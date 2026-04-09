/**
 * Wall-clock tick derivation. 120ms per tick.
 * Statusline runs once per Claude Code turn — animation is created by
 * reading the current wall-clock tick and rendering the appropriate frame.
 */
export declare const TICK_MS = 120;
export declare function currentTick(now?: number): number;
//# sourceMappingURL=tick.d.ts.map