/**
 * Enable / disable / uninstall hakcer-statusline from Claude Code settings.
 *
 * - --enable  → wire hakcer-statusline into ~/.claude/settings.json (backs up first)
 * - --disable → restore previous statusLine config (or remove ours)
 * - --uninstall → disable + print npm uninstall command
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
const COMMAND = "hakcer-statusline";
function claudePaths() {
    const dir = join(homedir(), ".claude");
    return {
        dir,
        settings: join(dir, "settings.json"),
        backup: join(dir, "settings.json.pre-hakcer"),
        stash: join(dir, ".hakcer-previous-statusline.json"),
    };
}
export function enableStatusline() {
    const p = claudePaths();
    if (!existsSync(p.settings)) {
        console.log("No ~/.claude/settings.json found. Is Claude Code installed?");
        return;
    }
    const settings = JSON.parse(readFileSync(p.settings, "utf8"));
    if (settings.statusLine?.command?.includes(COMMAND)) {
        console.log("Already enabled. Restart Claude Code to see it.");
        return;
    }
    // Back up settings (don't overwrite an existing backup)
    if (!existsSync(p.backup)) {
        copyFileSync(p.settings, p.backup);
        console.log(`Backed up settings → ${p.backup}`);
    }
    // Stash previous statusLine so --disable can restore it
    if (settings.statusLine) {
        writeFileSync(p.stash, JSON.stringify(settings.statusLine, null, 2) + "\n");
    }
    settings.statusLine = { type: "command", command: COMMAND };
    writeFileSync(p.settings, JSON.stringify(settings, null, 2) + "\n");
    console.log("hakcer-statusline enabled! Restart Claude Code to see it.");
    console.log("To undo: hakcer-statusline --disable");
}
export function disableStatusline() {
    const p = claudePaths();
    if (!existsSync(p.settings))
        return;
    const settings = JSON.parse(readFileSync(p.settings, "utf8"));
    if (!settings.statusLine?.command?.includes(COMMAND)) {
        console.log("hakcer-statusline is not currently enabled.");
        return;
    }
    // Restore previous config if we stashed one
    if (existsSync(p.stash)) {
        settings.statusLine = JSON.parse(readFileSync(p.stash, "utf8"));
        console.log("Restored previous statusLine config.");
    }
    else {
        delete settings.statusLine;
        console.log("Removed hakcer statusLine (back to Claude Code default).");
    }
    writeFileSync(p.settings, JSON.stringify(settings, null, 2) + "\n");
    console.log("Restart Claude Code to apply.");
    console.log("To re-enable: hakcer-statusline --enable");
}
export function uninstallStatusline() {
    disableStatusline();
    console.log("\nTo fully remove: npm uninstall -g hakcer");
}
//# sourceMappingURL=setup.js.map