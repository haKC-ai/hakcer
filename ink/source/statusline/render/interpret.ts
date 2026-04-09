/**
 * Scene interpreter — the central render component.
 * Takes a scene JSON + render context + library, returns a rendered ANSI string.
 */
import { Scene, SceneLibrary, RenderContext } from "../types.js";
import { applyDataMap } from "../data/resolver.js";
import { buildPaintFns, getPalette, stripAnsi } from "./palette.js";
import { resolveSeparator } from "./separator.js";
import { injectGlyphs } from "./glyph.js";
import { getEffect, EffectContext } from "./effects/index.js";

export function interpretScene(
  scene: Scene,
  ctx: RenderContext,
  library: SceneLibrary
): string {
  // 1. Substitute {tokens} from data_map
  const substituted = applyDataMap(scene.frame, scene.data_map, ctx.resolvedData);

  // 2. Resolve separator glyph and substitute any {sep} tokens in the frame
  const sepChar = resolveSeparator(scene, library, ctx.fontCaps);
  const withSep = substituted.replace(/\{sep\}/g, sepChar);

  // 3. Inject icon glyphs (or drop {icon:id} tokens)
  const withIcons = injectGlyphs(withSep, scene.icons, ctx.fontCaps);

  // 4. Look up palette
  const palette = getPalette(scene.palette, library);
  const paint = buildPaintFns(palette);

  // 5. Pick effect: scene override → pack default → color_wave
  const packDef = library.packs[scene.pack];
  const effectId =
    scene.effect ??
    (typeof packDef?.effect === "string" ? packDef.effect : undefined);
  const effectFn = getEffect(effectId);

  // 6. Build effect context
  const effectCtx: EffectContext = {
    tick: ctx.tick,
    palette,
    paint,
    width: ctx.width,
  };

  // 7. Apply the effect (which handles coloring itself)
  const animated = effectFn(withIcons, effectCtx);

  return animated;
}

// Clamp the final output to width, strip stray newlines, guarantee ANSI reset.
export function composeScene(rendered: string, width: number): string {
  const noNewlines = rendered.replace(/[\r\n]/g, " ");
  const plain = stripAnsi(noNewlines);

  if (plain.length <= width) {
    // Ensure reset at the end
    return noNewlines.endsWith("\x1b[0m") ? noNewlines : noNewlines + "\x1b[0m";
  }

  // Too wide — walk the string and clip to `width` visible chars
  let visible = 0;
  let out = "";
  let i = 0;
  while (i < noNewlines.length && visible < width) {
    const ch = noNewlines[i]!;
    if (ch === "\x1b") {
      // skip CSI sequence
      let j = i + 1;
      while (j < noNewlines.length && !/[a-zA-Z]/.test(noNewlines[j]!)) j++;
      out += noNewlines.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    out += ch;
    visible++;
    i++;
  }
  return out + "\x1b[0m";
}
