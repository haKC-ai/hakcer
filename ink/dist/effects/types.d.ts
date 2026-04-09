/**
 * Shared types for all effects.
 */
import type { ThemeColors } from "../themes.js";
export interface EffectFrame {
    /** Lines of ANSI-colored text to render */
    lines: string[];
    /** Whether this is the final frame */
    done: boolean;
}
export interface EffectState {
    /** Current frame data */
    frame: EffectFrame;
    /** Tick counter */
    tick: number;
}
export interface EffectConfig {
    /** The ASCII art split into a 2D char grid */
    grid: string[][];
    /** Theme colors to use */
    colors: ThemeColors;
    /** Total rows */
    rows: number;
    /** Total columns (max line width) */
    cols: number;
}
export type EffectFn = (config: EffectConfig, tick: number) => EffectFrame;
export interface EffectMeta {
    name: string;
    description: string;
    speed: "fast" | "medium" | "slow";
    fn: EffectFn;
}
//# sourceMappingURL=types.d.ts.map