/**
 * Palette resolver. Scene palette ids → hex colors → ANSI truecolor painters.
 *
 * Some palettes in scenes.json are not registered (the JSON has 20 palettes
 * but scenes reference ids like "matrix" and "neon" that come from the hakcer
 * banner themes). We build a unified registry from both sources.
 */
import { hexToRgb, lerpColor, rgbToAnsi, resetAnsi, RGB } from "../../colors.js";
import { PaletteDef, SceneLibrary } from "../types.js";

export interface PaintFns {
  fg: (s: string) => string;
  accent: (s: string) => string;
  gradient: (s: string) => string;
  bold: (s: string) => string;
  dim: (s: string) => string;
}

// Fallback palette colors for scene ids that are not defined in scenes.json
// (because the scenes were written against hakcer's existing banner themes).
const FALLBACK_PALETTES: Record<string, PaletteDef> = {
  matrix: { fg: "#00ff41", accent: "#008f11", glow: "#00ffaa" },
  neon: { fg: "#00ffff", accent: "#ff10f0", glow: "#7928ca" },
  amber_crt: { fg: "#ffb000", accent: "#ffc800", glow: "#ffd44f" },
  green_phosphor: { fg: "#33ff33", accent: "#00aa00", glow: "#88ffaa" },
  kali_red: { fg: "#ff073a", accent: "#b40018", glow: "#ff3860" },
  bbs_ansi: { fg: "#55ffff", accent: "#ff55ff", glow: "#ffff55" },
  c64_blue: { fg: "#7878f8", accent: "#a8a8ff", glow: "#4040c0" },
  gameboy_green: { fg: "#9bbc0f", accent: "#306230", glow: "#8bac0f" },
  aol_blue: { fg: "#0060a8", accent: "#4ea9e8", glow: "#a0d0ff" },
  tmnt_green: { fg: "#47aa42", accent: "#b23d3d", glow: "#f2c03c" },
  fire_red: { fg: "#ff4500", accent: "#ff8c00", glow: "#ffd700" },
  ice_blue: { fg: "#5fcfff", accent: "#aaffff", glow: "#003f7f" },
  warez_green: { fg: "#39ff14", accent: "#9eff9e", glow: "#005500" },
  phreaker_blue: { fg: "#00aaff", accent: "#00ffff", glow: "#003366" },
  "2600_red": { fg: "#ff1010", accent: "#ff6060", glow: "#660000" },
  napster_gray: { fg: "#c0c0c0", accent: "#ffffff", glow: "#404040" },
  kazaa_gold: { fg: "#ffd700", accent: "#ffae00", glow: "#663300" },
  irc_black: { fg: "#cccccc", accent: "#00ffaa", glow: "#333333" },
  nes_gray: { fg: "#bcbcbc", accent: "#fcfcfc", glow: "#6060cc" },
  gremlins_glow: { fg: "#39ff14", accent: "#b6ff00", glow: "#2d7a00" },
  gpk_pink: { fg: "#ff1493", accent: "#ffbfd8", glow: "#8b004d" },
};

export function getPalette(id: string, library: SceneLibrary): PaletteDef {
  const fromLib = library.palettes[id];
  if (fromLib && !Array.isArray(fromLib) && typeof fromLib === "object") {
    // Build a merged palette, with the library taking precedence over fallback.
    const fallback = FALLBACK_PALETTES[id] ?? FALLBACK_PALETTES.matrix!;
    return { ...fallback, ...(fromLib as PaletteDef) };
  }
  return FALLBACK_PALETTES[id] ?? FALLBACK_PALETTES.matrix!;
}

function paintHex(s: string, hex: string): string {
  if (!s) return s;
  const rgb = hexToRgb(normalizeHex(hex));
  return `${rgbToAnsi(rgb)}${s}${resetAnsi()}`;
}

export function normalizeHex(hex: string): string {
  if (!hex) return "#ffffff";
  if (hex.startsWith("#")) return hex;
  // Some palettes in scenes.json use 6-digit without #
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex}`;
  return "#ffffff";
}

export function buildPaintFns(palette: PaletteDef): PaintFns {
  const fgHex = normalizeHex(palette.fg);
  const accentHex = normalizeHex(palette.accent ?? palette.glow ?? palette.fg);
  const glowHex = normalizeHex(palette.glow ?? palette.accent ?? palette.fg);

  return {
    fg: (s) => paintHex(s, fgHex),
    accent: (s) => paintHex(s, accentHex),
    gradient: (s) => gradientLine(s, [fgHex, accentHex, glowHex]),
    bold: (s) => `\x1b[1m${paintHex(s, fgHex)}\x1b[22m`,
    dim: (s) => `\x1b[2m${paintHex(s, fgHex)}\x1b[22m`,
  };
}

// Paint a string with a left-to-right gradient across N color stops.
// Skips ANSI escape sequences already in the string (treats painted chars as-is).
export function gradientLine(text: string, stops: string[]): string {
  if (!text) return "";
  const cleaned = stripAnsi(text);
  const stopRgbs: RGB[] = stops.map((s) => hexToRgb(normalizeHex(s)));
  if (stopRgbs.length === 0) return text;

  const out: string[] = [];
  const len = cleaned.length;
  for (let i = 0; i < len; i++) {
    const ch = cleaned[i]!;
    if (ch === " ") {
      out.push(" ");
      continue;
    }
    const t = len <= 1 ? 0 : i / (len - 1);
    const segment = t * (stopRgbs.length - 1);
    const lo = Math.floor(segment);
    const hi = Math.min(stopRgbs.length - 1, lo + 1);
    const frac = segment - lo;
    const rgb = lerpColor(stopRgbs[lo]!, stopRgbs[hi]!, frac);
    out.push(`${rgbToAnsi(rgb)}${ch}`);
  }
  out.push(resetAnsi());
  return out.join("");
}

// Strip ANSI escape sequences — minimal, covers CSI and OSC.
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\x1b\[[0-9;]*[a-zA-Z]/g;
export function stripAnsi(s: string): string {
  return s.replace(ANSI_RE, "");
}
