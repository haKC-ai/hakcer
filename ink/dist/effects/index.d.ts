/**
 * Effect registry — all available effects and their metadata.
 */
import type { EffectMeta } from "./types.js";
export type { EffectFn, EffectFrame, EffectConfig, EffectState, EffectMeta } from "./types.js";
export declare const EFFECTS: Record<string, EffectMeta>;
export declare const FAST_EFFECTS: string[];
export declare const MEDIUM_EFFECTS: string[];
export declare const SLOW_EFFECTS: string[];
export declare const ALL_EFFECTS: string[];
export declare function listEffects(): string[];
export declare function getEffectsBySpeed(speed: "fast" | "medium" | "slow"): string[];
export declare function getRandomEffect(speed?: "fast" | "medium" | "slow" | "any"): string;
//# sourceMappingURL=index.d.ts.map