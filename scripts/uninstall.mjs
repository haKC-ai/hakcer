#!/usr/bin/env node
/**
 * preuninstall — remove hakcer-statusline from Claude Code's settings.json.
 *
 * Restores the previous statusLine config if we stashed one, otherwise
 * removes the statusLine key entirely (falls back to Claude Code default).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

try {
  const claudeDir = join(homedir(), ".claude");
  const settingsPath = join(claudeDir, "settings.json");

  if (!existsSync(settingsPath)) process.exit(0);

  const settings = JSON.parse(readFileSync(settingsPath, "utf8"));

  // Only touch it if we're the ones who set it
  if (!settings.statusLine?.command?.includes("hakcer-statusline")) {
    process.exit(0);
  }

  // Try to restore the previous config
  const stashPath = join(claudeDir, ".hakcer-previous-statusline.json");
  if (existsSync(stashPath)) {
    const previous = JSON.parse(readFileSync(stashPath, "utf8"));
    settings.statusLine = previous;
    console.log("[hakcer] Restored previous statusLine config.");
  } else {
    delete settings.statusLine;
    console.log("[hakcer] Removed hakcer statusLine (back to Claude Code default).");
  }

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  console.log("[hakcer] Restart Claude Code to apply.");
} catch (err) {
  console.error(`[hakcer] uninstall warning: ${err.message}`);
}
