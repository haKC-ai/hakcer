/**
 * 14 effect functions. Each is a pure function:
 *   (input, tick, paintFns, params) → output
 *
 * Effects are applied AFTER palette coloring. Some effects manipulate color,
 * others add glyph overlays or rearrange characters. All must preserve the
 * final string width (no adding visible chars).
 */
import { PaintFns, stripAnsi, normalizeHex, gradientLine } from "../palette.js";
import { hexToRgb, lerpColor, rgbToAnsi, resetAnsi } from "../../../colors.js";
import { PaletteDef } from "../../types.js";

export interface EffectContext {
  tick: number;
  palette: PaletteDef;
  paint: PaintFns;
  width: number;
}

export type EffectFn = (input: string, ctx: EffectContext) => string;

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

// Paint a single char with a specific hex. Skips spaces.
function paintChar(ch: string, hex: string): string {
  if (ch === " ") return " ";
  const rgb = hexToRgb(normalizeHex(hex));
  return `${rgbToAnsi(rgb)}${ch}\x1b[0m`;
}

// Apply a per-char painter to a plain (non-ANSI) string.
function paintEach(text: string, paintFn: (i: number, ch: string) => string): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    out += paintFn(i, text[i]!);
  }
  return out + resetAnsi();
}

// Deterministic PRNG from a seed — linear congruential.
function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// ──────────────────────────────────────────────────────────────────────────
// 1. scanline — bright cursor sweeps across
// ──────────────────────────────────────────────────────────────────────────
export const scanline: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const pos = ctx.tick % (plain.length + 4);
  const fg = normalizeHex(ctx.palette.fg);
  const accent = normalizeHex(ctx.palette.accent ?? ctx.palette.glow ?? ctx.palette.fg);

  return paintEach(plain, (i, ch) => {
    const dist = Math.abs(i - pos);
    if (dist === 0) return paintChar(ch, "#ffffff");
    if (dist === 1) return paintChar(ch, accent);
    return paintChar(ch, fg);
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 2. typewriter — reveal left-to-right
// ──────────────────────────────────────────────────────────────────────────
export const typewriter: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  // One char per 2 ticks. Loops with a 15-frame hold at the end.
  const cycle = len * 2 + 15;
  const phase = ctx.tick % cycle;
  const revealed = Math.min(len, Math.floor(phase / 2));

  const fg = normalizeHex(ctx.palette.fg);
  const accent = normalizeHex(ctx.palette.accent ?? fg);

  let out = "";
  for (let i = 0; i < len; i++) {
    if (i < revealed) {
      out += paintChar(plain[i]!, fg);
    } else if (i === revealed) {
      // cursor
      out += paintChar("█", accent);
    } else {
      out += " ";
    }
  }
  return out + resetAnsi();
};

// ──────────────────────────────────────────────────────────────────────────
// 3. glitch_corrupt — random char substitution, tick-seeded
// ──────────────────────────────────────────────────────────────────────────
const GLITCH_CHARS = "▓▒░█▀▄╳╲╱◢◣◤◥#@$%&*";
export const glitch_corrupt: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const rand = lcg(Math.floor(ctx.tick / 2));
  const fg = normalizeHex(ctx.palette.fg);
  const accent = normalizeHex(ctx.palette.accent ?? fg);

  return paintEach(plain, (_i, ch) => {
    if (ch === " ") return " ";
    if (rand() < 0.08) {
      const glitch = GLITCH_CHARS[Math.floor(rand() * GLITCH_CHARS.length)]!;
      return paintChar(glitch, accent);
    }
    return paintChar(ch, fg);
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 4. phosphor_fade — trailing chars fade to dim
// ──────────────────────────────────────────────────────────────────────────
export const phosphor_fade: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  const bright = normalizeHex(ctx.palette.fg);
  const dim = normalizeHex(ctx.palette.glow ?? ctx.palette.accent ?? "#003300");

  const brightRgb = hexToRgb(bright);
  const dimRgb = hexToRgb(dim);

  // Moving bright zone, position cycles, trailing fade behind
  const head = ctx.tick % (len + 20);

  return paintEach(plain, (i, ch) => {
    if (ch === " ") return " ";
    const dist = head - i;
    if (dist < 0 || dist > 12) {
      return paintChar(ch, dim);
    }
    const t = 1 - dist / 12;
    const mixed = lerpColor(dimRgb, brightRgb, t);
    return `${rgbToAnsi(mixed)}${ch}\x1b[0m`;
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 5. matrix_drip — katakana overlay between chars (same width, substitution)
// ──────────────────────────────────────────────────────────────────────────
const KATAKANA = "ｦｱｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
export const matrix_drip: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const rand = lcg(Math.floor(ctx.tick / 3));
  const bright = normalizeHex("#00ff41");
  const mid = normalizeHex(ctx.palette.fg);
  const dim = normalizeHex(ctx.palette.glow ?? "#003300");

  return paintEach(plain, (_i, ch) => {
    if (ch === " ") return " ";
    const r = rand();
    if (r < 0.12) {
      const kata = KATAKANA[Math.floor(rand() * KATAKANA.length)]!;
      return paintChar(kata, bright);
    }
    if (r < 0.4) return paintChar(ch, bright);
    if (r < 0.7) return paintChar(ch, mid);
    return paintChar(ch, dim);
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 6. decrypt_reveal — cipher chars cycling before settling
// ──────────────────────────────────────────────────────────────────────────
const CIPHER = "▓▒░█#@$%&?!*/<>=+";
export const decrypt_reveal: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  const cycle = 60;
  const phase = ctx.tick % cycle;

  const fg = normalizeHex(ctx.palette.fg);
  const accent = normalizeHex(ctx.palette.accent ?? fg);

  return paintEach(plain, (i, ch) => {
    if (ch === " ") return " ";
    const revealAt = (i * cycle) / len;
    if (phase >= revealAt) {
      return paintChar(ch, fg);
    }
    const cipherCh = CIPHER[(ctx.tick + i) % CIPHER.length]!;
    return paintChar(cipherCh, accent);
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 7. color_wave — hue rotation across the line
// ──────────────────────────────────────────────────────────────────────────
export const color_wave: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  const fgHex = normalizeHex(ctx.palette.fg);
  const accentHex = normalizeHex(ctx.palette.accent ?? fgHex);
  const glowHex = normalizeHex(ctx.palette.glow ?? fgHex);
  const stops = [hexToRgb(fgHex), hexToRgb(accentHex), hexToRgb(glowHex)];

  return paintEach(plain, (i, ch) => {
    if (ch === " ") return " ";
    const t = ((i / Math.max(1, len - 1)) + ctx.tick / 30) % 1;
    const seg = t * (stops.length - 1);
    const lo = Math.floor(seg);
    const hi = Math.min(stops.length - 1, lo + 1);
    const frac = seg - lo;
    const rgb = lerpColor(stops[lo]!, stops[hi]!, frac);
    return `${rgbToAnsi(rgb)}${ch}\x1b[0m`;
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 8. knight_rider — bouncing KITT scanner
// ──────────────────────────────────────────────────────────────────────────
export const knight_rider: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  const period = (len - 1) * 2;
  const t = ctx.tick % Math.max(1, period);
  const pos = t < len ? t : period - t;

  const fg = normalizeHex(ctx.palette.fg);
  const hot = "#ff0000";

  return paintEach(plain, (i, ch) => {
    if (ch === " ") return " ";
    const dist = Math.abs(i - pos);
    if (dist === 0) return paintChar(ch, "#ffffff");
    if (dist === 1) return paintChar(ch, hot);
    if (dist === 2) return paintChar(ch, fg);
    return `\x1b[2m${paintChar(ch, fg)}\x1b[22m`;
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 9. crt_boot — compressed scanline sweep (single-pass)
// ──────────────────────────────────────────────────────────────────────────
export const crt_boot: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  const cycle = len + 20;
  const phase = ctx.tick % cycle;

  const fg = normalizeHex(ctx.palette.fg);
  const accent = normalizeHex(ctx.palette.accent ?? fg);

  return paintEach(plain, (i, ch) => {
    if (ch === " ") return " ";
    if (phase < 5) {
      // flicker in
      return i % 2 === phase % 2 ? paintChar(ch, fg) : " ";
    }
    if (phase > len + 10) {
      return paintChar(ch, fg);
    }
    const head = phase - 5;
    if (i > head) return " ";
    if (i === head) return paintChar(ch, "#ffffff");
    if (i === head - 1) return paintChar(ch, accent);
    return paintChar(ch, fg);
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 10. static_noise — overlay sparse static chars
// ──────────────────────────────────────────────────────────────────────────
const NOISE = "░▒▓";
export const static_noise: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const rand = lcg(Math.floor(ctx.tick / 2));
  const fg = normalizeHex(ctx.palette.fg);
  const dim = normalizeHex(ctx.palette.glow ?? "#555555");

  return paintEach(plain, (_i, ch) => {
    if (ch === " ") return " ";
    if (rand() < 0.05) {
      const n = NOISE[Math.floor(rand() * NOISE.length)]!;
      return paintChar(n, dim);
    }
    return paintChar(ch, fg);
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 11. segment_slide — shift chars horizontally over time
// ──────────────────────────────────────────────────────────────────────────
export const segment_slide: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  const len = plain.length;
  if (len === 0) return "";

  // Shift from right on a slow cycle — every 20 frames, advance 1 char in
  const offset = Math.floor(ctx.tick / 4) % (len + 8);
  const fg = normalizeHex(ctx.palette.fg);

  let out = "";
  for (let i = 0; i < len; i++) {
    const src = i - offset + len;
    if (src < 0 || src >= len) {
      out += " ";
    } else {
      out += paintChar(plain[src]!, fg);
    }
  }
  // Once the full cycle completes, settle (don't loop forever via slide)
  if (offset >= len) {
    return paintEach(plain, (_i, ch) => paintChar(ch, fg));
  }
  return out + resetAnsi();
};

// ──────────────────────────────────────────────────────────────────────────
// 12. heartbeat — pulse bright/dim on a 60bpm cycle
// ──────────────────────────────────────────────────────────────────────────
export const heartbeat: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  // Tick is 120ms → 8 ticks per second → 8 ticks per beat for 60bpm
  const phase = ctx.tick % 8;
  const fgHex = normalizeHex(ctx.palette.fg);
  const accentHex = normalizeHex(ctx.palette.accent ?? fgHex);
  const fg = hexToRgb(fgHex);
  const accent = hexToRgb(accentHex);

  // Double-thump: 0=bright, 1=mid, 2=bright, 3=mid, 4-7=dim
  const intensityMap = [1.0, 0.7, 1.0, 0.5, 0.3, 0.2, 0.2, 0.2];
  const intensity = intensityMap[phase]!;

  const mixed = lerpColor(fg, accent, 1 - intensity);
  return paintEach(plain, (_i, ch) => {
    if (ch === " ") return " ";
    const r = Math.round(mixed.r * (0.3 + intensity * 0.7));
    const g = Math.round(mixed.g * (0.3 + intensity * 0.7));
    const b = Math.round(mixed.b * (0.3 + intensity * 0.7));
    return `${rgbToAnsi({ r, g, b })}${ch}\x1b[0m`;
  });
};

// ──────────────────────────────────────────────────────────────────────────
// 13. rainbow — simple rainbow cycle (used for konami/egg scenes)
// ──────────────────────────────────────────────────────────────────────────
const RAINBOW_STOPS = ["#ff0040", "#ff8000", "#ffff00", "#00ff40", "#00bfff", "#8040ff", "#ff00c0"];
export const rainbow: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  return gradientLine(plain, RAINBOW_STOPS.map((h, i) => {
    const idx = (i + Math.floor(ctx.tick / 2)) % RAINBOW_STOPS.length;
    return RAINBOW_STOPS[idx]!;
  }));
};

// ──────────────────────────────────────────────────────────────────────────
// 14. solid — no animation, just palette fg (safe fallback)
// ──────────────────────────────────────────────────────────────────────────
export const solid: EffectFn = (input, ctx) => {
  const plain = stripAnsi(input);
  return ctx.paint.fg(plain);
};

// ──────────────────────────────────────────────────────────────────────────
// Registry
// ──────────────────────────────────────────────────────────────────────────

export const EFFECTS: Record<string, EffectFn> = {
  scanline,
  typewriter,
  glitch_corrupt,
  phosphor_fade,
  matrix_drip,
  decrypt_reveal,
  color_wave,
  knight_rider,
  crt_boot,
  static_noise,
  segment_slide,
  heartbeat,
  rainbow,
  solid,
  // aliases that show up in scenes.json
  glitch: glitch_corrupt,
  decrypt: decrypt_reveal,
  colorshift: color_wave,
  matrix: matrix_drip,
  print: typewriter,
  wipe: segment_slide,
  slide: segment_slide,
  errorcorrect: glitch_corrupt,
  gradient: color_wave,
  pulse: heartbeat,
  scan: scanline,
};

export function getEffect(id: string | undefined): EffectFn {
  if (!id) return color_wave;
  return EFFECTS[id] ?? color_wave;
}
