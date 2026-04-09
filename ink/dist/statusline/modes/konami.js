/**
 * Konami easter egg: user runs `hakcer-statusline --konami` which writes a
 * marker file; the main render path watches for the file and pins the
 * `konami_winner` scene for 60 seconds.
 */
import { existsSync, writeFileSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
const CACHE_DIR = join(homedir(), ".cache", "hakcer-statusline");
const MARKER_FILE = join(CACHE_DIR, "konami.trigger");
const PIN_DURATION_MS = 60_000;
export function triggerKonami() {
    const { mkdirSync } = require("node:fs");
    mkdirSync(CACHE_DIR, { recursive: true });
    writeFileSync(MARKER_FILE, String(Date.now()));
}
export function konamiActive(now = Date.now()) {
    if (!existsSync(MARKER_FILE))
        return false;
    try {
        const stat = statSync(MARKER_FILE);
        const age = now - stat.mtimeMs;
        if (age > PIN_DURATION_MS) {
            try {
                unlinkSync(MARKER_FILE);
            }
            catch {
                // ignore
            }
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=konami.js.map