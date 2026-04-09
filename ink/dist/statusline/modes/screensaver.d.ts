/**
 * Screensaver: after idle timeout (default 300s since last render),
 * replace the statusline with a rotating banner until normal rendering resumes.
 */
import { PersistentState } from "../types.js";
export interface ScreensaverResult {
    active: boolean;
    line?: string;
}
export declare function checkScreensaver(state: PersistentState, now: number, width: number, tick: number, timeoutMs?: number): ScreensaverResult;
//# sourceMappingURL=screensaver.d.ts.map