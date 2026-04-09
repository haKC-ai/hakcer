import { applyDataMap } from "../data/resolver.js";
import { buildPaintFns, getPalette, stripAnsi } from "./palette.js";
import { resolveSeparator } from "./separator.js";
import { injectGlyphs } from "./glyph.js";
import { decorate } from "./decorate.js";
import { getEffect, isMotionEffect } from "./effects/index.js";
export function interpretScene(scene, ctx, library) {
    // 0. Pick the frame text. If the scene has a flipbook `frames` array,
    //    step through them at `frameTicks` speed (default 4 ticks/frame).
    //    Otherwise use the single `frame` string.
    const sourceFrame = pickFrameText(scene, ctx.tick);
    // 1. Substitute {tokens} from data_map
    const substituted = applyDataMap(sourceFrame, scene.data_map, ctx.resolvedData);
    // 2. Resolve separator glyph and substitute any {sep} tokens in the frame
    const sepChar = resolveSeparator(scene, library, ctx.fontCaps);
    const withSep = substituted.replace(/\{sep\}/g, sepChar);
    // 3. Inject icon glyphs (or drop {icon:id} tokens)
    const withIcons = injectGlyphs(withSep, scene.icons, ctx.fontCaps);
    // 3b. Auto-decorate with verb/pack-derived glyph pair. Every scene gets
    //     a left and right Nerd Font glyph based on what it represents, so
    //     the 167-scene library is visually dense without touching scenes.json.
    const decorated = decorate(withIcons, scene, ctx.fontCaps);
    // 4. Look up palette
    const palette = getPalette(scene.palette, library);
    const paint = buildPaintFns(palette);
    // 5. Pick effect:
    //    - Flipbook scenes: default to `solid` so the frames themselves carry
    //      the motion and don't get smeared by a transform.
    //    - Non-flipbook scenes: MUST move. If the scene or pack specifies a
    //      true motion effect (scanline, typewriter, knight_rider, …), keep
    //      it; otherwise replace the color-cycling "flashy text" default
    //      (color_wave, rainbow, heartbeat) with `marquee` so every character
    //      actually translates across the line.
    const packDef = library.packs[scene.pack];
    const hasFlipbook = Array.isArray(scene.frames) && scene.frames.length > 1;
    let effectId;
    if (hasFlipbook) {
        effectId = scene.effect ?? "solid";
    }
    else {
        const sceneEffect = scene.effect;
        const packEffect = typeof packDef?.effect === "string" ? packDef.effect : undefined;
        if (isMotionEffect(sceneEffect)) {
            effectId = sceneEffect;
        }
        else if (isMotionEffect(packEffect)) {
            effectId = packEffect;
        }
        else {
            effectId = "marquee";
        }
    }
    const effectFn = getEffect(effectId);
    // 6. Build effect context
    const effectCtx = {
        tick: ctx.tick,
        palette,
        paint,
        width: ctx.width,
    };
    // 7. Apply the effect (which handles coloring itself)
    const animated = effectFn(decorated, effectCtx);
    return animated;
}
function pickFrameText(scene, tick) {
    const frames = scene.frames;
    if (!Array.isArray(frames) || frames.length === 0)
        return scene.frame;
    if (frames.length === 1)
        return frames[0];
    const step = Math.max(1, scene.frameTicks ?? 4);
    const idx = Math.floor(tick / step) % frames.length;
    return frames[idx];
}
// Clamp the final output to width, strip stray newlines, guarantee ANSI reset,
// and clear to end of line so prior terminal residue never bleeds through.
//
// Budget is `width - 2` to leave slack for wide glyphs (Nerd Font icons,
// katakana, some powerline chars render ≥1 cell in certain fonts).
export function composeScene(rendered, width) {
    const noNewlines = rendered.replace(/[\r\n]/g, " ");
    const budget = Math.max(1, width - 2);
    const plain = stripAnsi(noNewlines);
    const tail = "\x1b[0m\x1b[K";
    if (plain.length <= budget) {
        return (noNewlines.endsWith("\x1b[0m") ? noNewlines : noNewlines) + tail;
    }
    // Too wide — walk the string and clip to `budget` visible chars
    let visible = 0;
    let out = "";
    let i = 0;
    while (i < noNewlines.length && visible < budget) {
        const ch = noNewlines[i];
        if (ch === "\x1b") {
            // skip CSI sequence
            let j = i + 1;
            while (j < noNewlines.length && !/[a-zA-Z]/.test(noNewlines[j]))
                j++;
            out += noNewlines.slice(i, j + 1);
            i = j + 1;
            continue;
        }
        out += ch;
        visible++;
        i++;
    }
    return out + tail;
}
//# sourceMappingURL=interpret.js.map