/**
 * Detect Nerd Font capability.
 *
 * Default is **ON** — the whole point of this tool is Nerd Font glyphs. Only
 * explicitly disable for known-broken contexts (VS Code integrated terminal
 * without a Nerd Font configured) or when the user sets the override to 0.
 */
import { FontCaps } from "../types.js";
export declare function detectFontCaps(env?: NodeJS.ProcessEnv): FontCaps;
//# sourceMappingURL=font-detect.d.ts.map