#!/usr/bin/env node
/**
 * postinstall — wire hakcer-statusline into Claude Code's settings.json.
 *
 * - Finds ~/.claude/settings.json
 * - Backs up current settings to ~/.claude/settings.json.pre-hakcer
 * - Sets statusLine to { type: "command", command: "hakcer-statusline" }
 * - If already set, skips silently
 *
 * Safe: backs up first, never clobbers a backup that already exists,
 * and exits 0 even on failure (npm postinstall must not break installs).
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const COMMAND = "hakcer-statusline";

try {
  const claudeDir = join(homedir(), ".claude");
  const settingsPath = join(claudeDir, "settings.json");

  if (!existsSync(settingsPath)) {
    console.log("[hakcer] No ~/.claude/settings.json found — skipping auto-configure.");
    console.log("[hakcer] To enable manually: hakcer-statusline --enable");
    process.exit(0);
  }

  const raw = readFileSync(settingsPath, "utf8");
  const settings = JSON.parse(raw);

  // Already configured?
  if (
    settings.statusLine?.type === "command" &&
    settings.statusLine?.command?.includes("hakcer-statusline")
  ) {
    console.log("[hakcer] statusLine already configured — nothing to do.");
    process.exit(0);
  }

  // Back up (don't overwrite an existing backup — user might have their own)
  const backupPath = join(claudeDir, "settings.json.pre-hakcer");
  if (!existsSync(backupPath)) {
    copyFileSync(settingsPath, backupPath);
    console.log(`[hakcer] Backed up settings → ${backupPath}`);
  }

  // Also stash the old statusLine command so --disable can restore it
  if (settings.statusLine) {
    const stashPath = join(claudeDir, ".hakcer-previous-statusline.json");
    writeFileSync(stashPath, JSON.stringify(settings.statusLine, null, 2) + "\n");
  }

  // Wire it up
  settings.statusLine = {
    type: "command",
    command: COMMAND,
  };

  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  console.log("[hakcer] Claude Code statusLine configured!");
  console.log("[hakcer] Restart Claude Code to see it. To undo: hakcer-statusline --disable");
} catch (err) {
  // Never break npm install
  console.error(`[hakcer] postinstall warning: ${err.message}`);
  console.error("[hakcer] You can configure manually: hakcer-statusline --enable");
}
