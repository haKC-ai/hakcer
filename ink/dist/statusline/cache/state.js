/**
 * Persistent state read/write. Lives at ~/.cache/hakcer-statusline/state.json.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
const CACHE_DIR = join(homedir(), ".cache", "hakcer-statusline");
const STATE_FILE = join(CACHE_DIR, "state.json");
export function readState() {
    try {
        if (!existsSync(STATE_FILE))
            return {};
        const raw = readFileSync(STATE_FILE, "utf8");
        return JSON.parse(raw);
    }
    catch {
        return {};
    }
}
export function writeState(state) {
    try {
        mkdirSync(CACHE_DIR, { recursive: true });
        writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    }
    catch {
        // ignore
    }
}
export function getCacheDir() {
    return CACHE_DIR;
}
//# sourceMappingURL=state.js.map