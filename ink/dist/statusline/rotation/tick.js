/**
 * Wall-clock tick derivation. 120ms per tick.
 * Statusline runs once per Claude Code turn — animation is created by
 * reading the current wall-clock tick and rendering the appropriate frame.
 */
export const TICK_MS = 120;
export function currentTick(now = Date.now()) {
    return Math.floor(now / TICK_MS);
}
//# sourceMappingURL=tick.js.map