#!/usr/bin/env bash
# Render every scene once, back-to-back, labeled. Requires a Nerd Font terminal.
set -euo pipefail
cd "$(dirname "$0")/.."

STDIN='{"session_id":"demo","model":{"id":"claude-opus-4-6"},"transcript_path":"/tmp/x","cwd":"/tmp"}'
WIDTH="${WIDTH:-100}"

# The label uses gray (ANSI 90) + reset so it doesn't clash with scene color.
label() { printf '\033[90m%-30s\033[0m │ ' "$1"; }

# Pick a subset (all 166 is a lot) — override with PACK=core for single pack.
PACK="${PACK:-}"
if [[ -n "$PACK" ]]; then
  SCENES=$(node --input-type=module -e "
    import { readFileSync } from 'node:fs';
    const lib = JSON.parse(readFileSync('dist/statusline/data/scenes.json', 'utf8'));
    const ids = lib.scenes.filter(s => s.pack === '$PACK' && s.id !== 'konami_winner').map(s => s.id);
    process.stdout.write(ids.join('\n'));
  ")
else
  SCENES=$(node --input-type=module -e "
    import { readFileSync } from 'node:fs';
    const lib = JSON.parse(readFileSync('dist/statusline/data/scenes.json', 'utf8'));
    const ids = lib.scenes.filter(s => s.id !== 'konami_winner').map(s => s.id);
    process.stdout.write(ids.join('\n'));
  ")
fi

printf '\n\033[1;97m━━━ hakcer-statusline gallery ━━━\033[0m  width=%s  pack=%s\n\n' "$WIDTH" "${PACK:-all}"

while IFS= read -r id; do
  label "$id"
  echo "$STDIN" | node dist/statusline/cli.js --scene "$id" --no-screensaver --width "$WIDTH" 2>/dev/null
  echo
done <<< "$SCENES"

printf '\n\033[1;97m━━━ gallery end ━━━\033[0m\n'
