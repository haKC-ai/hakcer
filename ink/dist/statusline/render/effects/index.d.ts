/**
 * 14 effect functions. Each is a pure function:
 *   (input, tick, paintFns, params) → output
 *
 * Effects are applied AFTER palette coloring. Some effects manipulate color,
 * others add glyph overlays or rearrange characters. All must preserve the
 * final string width (no adding visible chars).
 */
import { PaintFns } from "../palette.js";
import { PaletteDef } from "../../types.js";
export interface EffectContext {
    tick: number;
    palette: PaletteDef;
    paint: PaintFns;
    width: number;
}
export type EffectFn = (input: string, ctx: EffectContext) => string;
export declare const scanline: EffectFn;
export declare const typewriter: EffectFn;
export declare const glitch_corrupt: EffectFn;
export declare const phosphor_fade: EffectFn;
export declare const matrix_drip: EffectFn;
export declare const decrypt_reveal: EffectFn;
export declare const color_wave: EffectFn;
export declare const knight_rider: EffectFn;
export declare const crt_boot: EffectFn;
export declare const static_noise: EffectFn;
export declare const segment_slide: EffectFn;
export declare const heartbeat: EffectFn;
export declare const rainbow: EffectFn;
export declare const solid: EffectFn;
export declare const marquee: EffectFn;
export declare const EFFECTS: Record<string, EffectFn>;
export declare const MOTION_EFFECTS: Set<string>;
export declare function isMotionEffect(id: string | undefined): boolean;
export declare function getEffect(id: string | undefined): EffectFn;
//# sourceMappingURL=index.d.ts.map