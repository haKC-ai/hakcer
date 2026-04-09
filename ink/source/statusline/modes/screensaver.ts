/**
 * Screensaver: after idle timeout (default 300s since last render),
 * replace the statusline with a rotating banner until normal rendering resumes.
 */
import { PersistentState } from "../types.js";

const DEFAULT_TIMEOUT_MS = 300_000;

const BANNERS = [
  "IDLE — cosmic rays only   ~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~",
  "screensaver · no-signal · waiting · press any key · press any key · press",
  "[...standby...]  0xDEADBEEF  [...standby...]  0xCAFEBABE  [...standby...]",
  "ZzZz   awaiting input · no carrier · waiting for DCD · monitor autosleep",
];

export interface ScreensaverResult {
  active: boolean;
  line?: string;
}

export function checkScreensaver(
  state: PersistentState,
  now: number,
  width: number,
  tick: number,
  timeoutMs = DEFAULT_TIMEOUT_MS
): ScreensaverResult {
  const last = state.lastRenderAt ?? now;
  const idle = now - last;
  if (idle < timeoutMs) return { active: false };

  const banner = BANNERS[Math.floor(tick / 40) % BANNERS.length]!;
  const clipped = banner.padEnd(width, " ").slice(0, width);
  return {
    active: true,
    line: `\x1b[2;37m${clipped}\x1b[0m`,
  };
}
