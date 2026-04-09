const DEFAULT_TIMEOUT_MS = 300_000;
const BANNERS = [
    "IDLE — cosmic rays only   ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~",
    "screensaver · no-signal · waiting · press any key · press any key · press",
    "[...standby...]  0xDEADBEEF  [...standby...]  0xCAFEBABE  [...standby...]",
    "ZzZz   awaiting input · no carrier · waiting for DCD · monitor autosleep",
];
export function checkScreensaver(state, now, width, tick, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const last = state.lastRenderAt ?? now;
    const idle = now - last;
    if (idle < timeoutMs)
        return { active: false };
    const banner = BANNERS[Math.floor(tick / 40) % BANNERS.length];
    const clipped = banner.padEnd(width, " ").slice(0, width);
    return {
        active: true,
        line: `\x1b[2;37m${clipped}\x1b[0m`,
    };
}
//# sourceMappingURL=screensaver.js.map