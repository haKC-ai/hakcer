# hakcer-statusline — Design Spec

> **Status:** Revised draft (v2) — pivoted onto the JSON content library. Pending implementation plan.
> **Date:** 2026-04-08 (revised same day)
> **Author:** Cory Kennedy (@NoDataFound) + Claude (brainstorm)
> **Project:** [hakcer-1](https://github.com/NoDataFound/hakcer)
> **Target version:** hakcer@1.3.0

## 0. Revision notes (v1 → v2)

The v1 spec assumed scenes would be hand-coded TypeScript files in `scenes/*.ts`. In parallel with the v1 brainstorm, the author built [ink/source/statusline/data/scenes.json](ink/source/statusline/data/scenes.json) — a complete 157-scene declarative content library covering 19 culture packs, 20 palettes, 14 effects, 18 separator styles, 5 glyph registries, and 6 special modes. v2 pivots the architecture onto this JSON as the single source of truth. The engine becomes a generic interpreter that loads the JSON, substitutes `{token}` placeholders with live session data, and applies the referenced palette/separator/glyph/effect combinations.

The pivot simplifies the code path (no per-scene TS files) and improves the contribution story (new scenes are JSON edits, no TypeScript required). All §3, §4, §5 reworked. §6 gains a dotted-path resolver. §7 gains pack filtering. §9 gains a render resolver chain. New §9b covers special modes. New §9c covers font policy. Demos (§13) shift from per-scene to per-pack recordings.

## 1. Summary

A Claude Code statusline that replaces the conventional cost/context/git readout with animated full-width "hacking scenes" — matrix rain, Napster-vs-Metallica drama, AOL progz, DELTREE accidents, BBS ANSI art, Jurassic Park Unix, TMNT sewer HQ, 154+ more. Each scene is a different **visual lens** on the same live session data (model, cost, context %, git branch); data scenes weave the data into the scene, theater scenes are pure retro-hacker culture.

Scenes are **declarative JSON data**, not code. The engine loads [ink/source/statusline/data/scenes.json](ink/source/statusline/data/scenes.json) once per invocation, selects a scene via the rotation engine, substitutes placeholders via a dotted-path data resolver, applies the referenced palette + separator + glyph registry, and runs the scene through one of 14 effect animations. Rotation is time-based with trigger overrides (context ≥ 90 % → buffer-overflow, cost ≥ $5 → msf kill chain, ctx ≥ 98 % → kernel panic, and so on).

**Six special modes** layer on top of the normal render path: `corruption` (1-in-50 frames flash SEGFAULT/BSOD/GURU MEDITATION), `konami_easter_egg` (↑↑↓↓←→←→BA unlocks hidden scene), `sound_mode`, `combo_frames`, `screensaver` (idle timeout → banner + synthgrid), and `motd_rotation`.

**Event providers** (opt-in) fetch upcoming meetup data on a cached background schedule. **SecKC** is the reference provider, scraping `https://www.seckc.org/upcoming-events?format=json-pretty`. When the next event is within 7 days, `events_seckc_upcoming` enters the rotation pool; on event day, `events_seckc_today` is force-pinned for 5 minutes.

The statusline ships inside the existing `hakcer` Ink package as a second CLI bin (`hakcer-statusline`), wired into `~/.claude/settings.json` via `npx hakcer-statusline`. Nerd Fonts are recommended but optional — the render pipeline detects missing glyph support and falls back gracefully, and an explicit `hakcer-statusline --install-fonts` command downloads JetBrains Mono Nerd Font for users who want the full experience.

### Primary goals

1. Ship a daily-driver statusline whose visual identity is unmistakably `hakcer`.
2. Double as marketing for the `hakcer` package — screenshots and GIFs should sell it.
3. Make scene contribution trivial: edit one JSON object, open a PR. No TypeScript knowledge required.
4. Reactive session-state triggers are the hero feature. Context pressure and cost escalation visibly change what the statusline is doing.
5. The 19 culture packs make the tool a nostalgia playground — users can enable `--pack=warez,phreaking,2600` to theme their session around a subculture.

### Non-goals (v1)

- TOML / YAML config files (CLI flags only).
- Starship passthrough modules.
- Windows PowerShell support.
- Multi-line statuslines.
- Custom user-local scenes outside the committed JSON (e.g., `~/.config/hakcer-statusline/scenes.json`).
- Telemetry of any kind.
- Rust rewrite for sub-10ms speed.
- Auto-installing Nerd Fonts during `npm install -g hakcer` (user must opt in via `--install-fonts`).

## 2. Context and prior art

| Project | Stars | Language | What we take from it |
|---------|-------|----------|----------------------|
| [stephenleo/cship](https://github.com/stephenleo/cship) | 312 | Rust | Module system, context bar concept, warn/critical thresholds, Claude Code JSON stdin protocol |
| [levz0r/claude-code-statusline](https://github.com/levz0r/claude-code-statusline) | 1 | Bash | Transcript JSONL tail-read, per-model pricing math, input + cache_read + cache_write + output token decomposition |
| [epidemian/snake](https://github.com/epidemian/snake) | 1,381 | JS | Constraint model: playable "game" feel in a single-line braille canvas |
| [charmbracelet/vhs](https://github.com/charmbracelet/vhs) | — | Go | Terminal demo recording for README / GitHub Pages GIFs |
| [ryanoasis/nerd-fonts](https://github.com/ryanoasis/nerd-fonts) | — | — | Glyph source for font_logos (OS/WM icons) and powerline separators |

**What we do that neither cship nor levz0r does:**
- Animated scenes replace the data readout — scenes *are* the statusline
- Reactive session-state overrides with pin durations
- 19-pack retro-hacker culture library (157 scenes spanning 1980s BBS culture to late-90s Napster wars)
- Declarative JSON content model — contribute a scene by editing JSON

**Existing hakcer assets reused:**
- [ink/source/effects/](ink/source/effects/) — 11 pure-function effects that return `{ lines, done }` per tick. Mapped to the 14 statusline effects via the `effects._hakcer_to_statusline_map` in the JSON.
- [ink/source/themes.ts](ink/source/themes.ts) — referenced as `_existing_hakcer_themes` in the JSON's palettes section.
- [ink/source/colors.ts](ink/source/colors.ts) — ANSI helper primitives.

## 3. Architecture

### 3.1 File layout

```
ink/source/statusline/
├── cli.ts                     # bin entry — invoked via `npx hakcer-statusline`
├── main.ts                    # orchestrator: flags → stdin → scenes.json → pick → render → write → exit
├── types.ts                   # TS types mirroring the scenes.json schema + engine types
│
├── data/
│   ├── scenes.json            # THE CONTENT LIBRARY (157 scenes, 20 palettes, 19 packs, etc.)
│   ├── parse-stdin.ts         # Claude Code JSON payload reader (50ms timeout)
│   ├── transcript.ts          # tail-read .jsonl → token usage from last assistant turn
│   ├── pricing.ts             # per-model cost calc + context window maxes
│   ├── git.ts                 # branch / dirty / ahead-behind via execFile (200ms timeout)
│   ├── resolver.ts            # dotted-path data resolver for data_map templates
│   └── providers/
│       ├── index.ts           # codegen'd auto-import of all providers
│       ├── types.ts           # EventProvider, UpcomingEvent
│       ├── _template.ts       # contributor template
│       └── seckc.ts           # Squarespace JSON scraper
│
├── rotation/
│   ├── select.ts              # scene picker: forced triggers → time-based pool index
│   ├── triggers.ts            # trigger rules, priority, pinning
│   ├── pools.ts               # pack filtering, --scenes/--exclude honoring
│   └── tick.ts                # wall-clock tick derivation
│
├── render/
│   ├── interpret.ts           # THE SCENE INTERPRETER: scene JSON → ANSI string
│   ├── palette.ts             # palette resolver (scene.palette → 20 palettes → hex/rgb)
│   ├── separator.ts           # separator resolver (scene.sep → 18 styles → glyph)
│   ├── glyph.ts               # glyph registry resolver (icons[] → codepoints)
│   ├── effects/
│   │   ├── index.ts
│   │   ├── scanline.ts
│   │   ├── typewriter.ts
│   │   ├── glitch_corrupt.ts
│   │   ├── phosphor_fade.ts
│   │   ├── matrix_drip.ts
│   │   ├── decrypt_reveal.ts
│   │   ├── color_wave.ts
│   │   ├── knight_rider.ts
│   │   ├── crt_boot.ts
│   │   ├── static_noise.ts
│   │   ├── segment_slide.ts
│   │   └── heartbeat.ts
│   ├── width.ts               # COLUMNS > tty > 80 detection
│   ├── compose.ts             # interpret() + width clamp + ANSI reset
│   └── font-detect.ts         # Nerd Font capability sniff + fallback registry
│
├── modes/
│   ├── corruption.ts          # 1-in-N frame SEGFAULT/BSOD/GURU MEDITATION flash
│   ├── konami.ts              # key buffer + hidden scene unlock
│   ├── screensaver.ts         # idle timeout → banner + synthgrid/matrix/fireworks
│   ├── sound.ts               # per-scene sound hooks (spawn `afplay` / `paplay`)
│   ├── combo.ts               # frame-boundary seam blending
│   └── motd.ts                # daily rotation source
│
├── cache/
│   └── events.ts              # ~/.cache/hakcer-statusline/ cache + background refresh
│
├── fonts/
│   └── install.ts             # --install-fonts implementation (download + install Nerd Font)
│
└── __tests__/
    ├── scenes.test.ts         # invariants across all 157 scenes × widths × palettes
    ├── interpret.test.ts      # scene JSON → rendered output, placeholder substitution
    ├── rotation.test.ts       # trigger priority, pinning, pack filtering
    ├── transcript.test.ts     # tail-read against fixture .jsonl files
    ├── pricing.test.ts        # cost math per model
    ├── cache.test.ts          # TTL, corruption recovery
    ├── modes.test.ts          # corruption PRNG, konami key buffer, screensaver idle
    ├── providers/seckc.test.ts
    ├── font-detect.test.ts
    └── fixtures/
        ├── transcript.jsonl
        ├── seckc.json
        └── stdin.json

ink/statusline/demos/
├── tapes/                     # VHS .tape files, one per pack + hero + triggers
├── out/                       # generated GIFs (not committed; see §13)
├── scripts/
│   ├── record-all.sh
│   └── publish.sh             # force-push GIFs to orphan `demos` branch
└── docs/                      # GitHub Pages source (index.html + css + images)
```

**What disappeared from v1**: `scenes/*.ts` (one file per scene) and the `scenes/_template.ts` contributor template. Scenes now live in JSON. TypeScript is only the engine.

### 3.2 Package wiring

Same as v1:

```json
// ink/package.json
{
  "bin": {
    "hakcer":            "dist/cli.js",
    "hakcer-statusline": "dist/statusline/cli.js"
  }
}
```

Install story:

```json
// ~/.claude/settings.json
{
  "statusLine": {
    "type": "command",
    "command": "npx hakcer-statusline"
  }
}
```

### 3.3 Execution model

Same as v1 — bypass Ink entirely at statusline runtime. The statusline path is pure TypeScript + `kleur` + `fs`. Cold-start budget < 80 ms on an M1.

Hot path per Claude Code turn:

1. `cli.ts` → `main(process.argv)`
2. Parse flags (strict allowlist)
3. Read `process.stdin` JSON (50 ms timeout)
4. Load `scenes.json` (cached in memory across the lifetime of the process — but the process only lives one turn, so it's read once per render)
5. Walk transcript, run git, read events cache — all parallelized via `Promise.all`
6. Build `SessionData`
7. Rotation engine picks the active scene from `scenes.json`
8. `interpret.ts` renders the scene: template substitution → palette apply → separator resolution → glyph resolution → effect animation frame
9. `compose.ts` clamps to width and appends ANSI reset
10. Apply active special modes (corruption can override the frame, konami buffer updates, screensaver idle check)
11. `process.stdout.write(line)`
12. Background event refresh if stale (detached child process)
13. Write `state.json` (last branch, last model, active override, konami buffer state, screensaver timer)
14. `process.exit(0)`

## 4. Scene contract (JSON schema)

This is now the single most important contract in the project. Contributors edit this shape in `scenes.json`. The TypeScript `Scene` type is derived from it via `tsx` codegen against a JSON Schema definition committed at [ink/source/statusline/data/scenes.schema.json](ink/source/statusline/data/scenes.schema.json).

### 4.1 Scene object

```json
{
  "id": "core_matrix_rain",
  "name": "Matrix Rain + Data",
  "pack": "core",
  "type": "data",
  "verb": "DECODING",
  "sep": "arrow",
  "palette": "matrix",
  "icons": [],
  "frame": "ｦ8 {model} ｷ {cost} ｲ [{ctx_bar}] {ctx}% ﾑ {git} ﾒ",
  "data_map": {
    "model": "model",
    "cost": "cost",
    "ctx": "context_pct",
    "git": "git_branch"
  },
  "desc": "Katakana interference sprinkled through real data. Green gradient fall."
}
```

### 4.2 Field semantics

| Field | Required | Type | Meaning |
|-------|----------|------|---------|
| `id` | yes | string | Kebab/snake-case unique identifier. Used by `--scene=<id>`, trigger overrides, and `--preview`. |
| `name` | yes | string | Human-readable display name (used in `--list` output and README). |
| `pack` | yes | string | Pack id (one of the 19 in `packs`). Enables `--pack=<id>` filtering. |
| `type` | yes | `"data"` \| `"theater"` | Data scenes weave `{tokens}` from session data into the frame. Theater scenes ignore session data. |
| `verb` | yes | string | Short uppercase spinner verb: `PWNING`, `DECODING`. Shown in tight modes and as the scene label. |
| `sep` | no | string | Separator style id (one of the 18 in `separator_map`). Defaults to the pack's `separator_map[pack]` entry. |
| `palette` | yes | string | Palette id (one of the 20 in `palettes`). Overridden by the global `--palette=<id>` flag. |
| `icons` | no | string[] | Glyph ids from `glyph_registry`. Resolved to actual codepoints at render time. |
| `frame` | yes | string | Template string. `{identifier}` placeholders are substituted via `data_map` during render. Theater scenes typically have no placeholders. |
| `data_map` | no | object | Maps template placeholder names → dotted-path data source keys. Values like `"model"`, `"context_pct"`, `"events.seckc.next.title"`. See §6.5 for resolver. |
| `desc` | yes | string | One-line description. Shown in `--list` and used in CONTRIBUTING.md gallery. |
| `effect` | no | string | Optional per-scene effect override (id from `effects`). Default: pack-level effect, then scene's palette-derived effect. |
| `durationFrames` | no | number | Frames before rotation advances. Defaults to 150 (≈18s at 120ms tick). |

### 4.3 Invariants enforced by the test suite

Applied to every scene in `scenes.json` across widths `{60, 80, 120, 200}` and sample `SessionData` fixtures:

1. `stripAnsi(rendered).length <= width` at every tested width.
2. ANSI escape sequences are balanced — no leaked state.
3. No newlines in rendered output.
4. All placeholders in `frame` are present as keys in `data_map` (data scenes) or absent (theater scenes).
5. `palette` references an existing entry in `palettes`.
6. `pack` references an existing entry in `packs`.
7. `sep`, if set, references an existing entry in `separator_map`.
8. Every item in `icons`, if set, references an existing glyph id in `glyph_registry`.
9. `id` is unique across the whole array.
10. Render time < 5 ms per frame on CI hardware.
11. Deterministic: same `(scene, tick, width, data)` → byte-identical output.

The test suite reads `scenes.json` at test startup and parameterizes one test per scene per invariant per width. Approximately 157 × 4 widths × 11 invariants ≈ 7000 assertions, most of them cheap (milliseconds).

### 4.4 Contribution flow (no TypeScript required)

Documented in [CONTRIBUTING.md](CONTRIBUTING.md):

1. Open `ink/source/statusline/data/scenes.json`.
2. Find the pack where your scene belongs (or add a new pack entry in `packs` first).
3. Copy an existing scene entry as a template.
4. Fill in `id` (unique), `name`, `pack`, `type`, `verb`, `palette`, `frame` (with `{placeholders}` if `type: "data"`), `data_map`, `desc`.
5. `pnpm test -- scenes.test.ts` — invariant suite validates your new scene automatically.
6. `pnpm build && npx hakcer-statusline --preview --scene=<your-id>` — see it animate live.
7. Optional: add a VHS tape at `ink/statusline/demos/tapes/<your-id>.tape` — CI will generate the GIF on merge.
8. Open a PR. `security-auditor` subagent runs on the diff. Merge when green.

**Adding a new pack** is a JSON edit too — add an entry to `packs` with `flag` and `desc`, optionally add an entry to `separator_map` for a pack-default separator, done.

## 5. Scene library (current state: 157 scenes, 19 packs)

Full library lives in [ink/source/statusline/data/scenes.json](ink/source/statusline/data/scenes.json). This section summarizes the pack catalog and the distribution — do not duplicate individual scene definitions here. The JSON is authoritative.

### 5.1 Pack catalog

| Pack | Flag | Scenes | Vibe |
|------|------|--------|------|
| `core` | `--pack=core` | 24 | The universal hacker-culture bedrock. Matrix, decrypt, base64, pcb, port-scan, msf, snake, kernel-panic, SecKC events, etc. |
| `movies` | `--pack=movies` | 15 | Jurassic Park Unix, WarGames WOPR, Hackers "hack the planet," Sneakers, Swordfish |
| `toys` | `--pack=toys` | 12 | Power Glove boot, Speak & Spell, Tamagotchi, Simon Says |
| `dos` | `--pack=dos` | 12 | FORMAT C:, DELTREE accidents, BAT file viruses, ATTRIB +H, EDIT.COM |
| `2600` | `--pack=2600` | 10 | 2600 Magazine, TOTSE, 2600 First Friday meetings, Phrack, CDC |
| `tv80s` | `--pack=tv80s` | 10 | Knight Rider KITT, A-Team, MacGyver, MASK, TMNT |
| `trikc` | `--pack=trikc` | 10 | TRIKC-themed: modded Power Glove, NES title screens, TRIKC-branded demo scenes |
| `arcade` | `--pack=arcade` | 9 | Gauntlet, Mortal Kombat, NBA Jam, Street Fighter, Pac-Man |
| `early_web` | `--pack=early_web` | 9 | GeoCities, Angelfire marquees, Newgrounds Flash, guestbooks, webrings |
| `warez` | `--pack=warez` | 8 | NFO headers, keygen music, FTP ratios, nuke, courier, XDCC, greetz |
| `p2p` | `--pack=p2p` | 7 | Napster downloads, Metallica vs Napster drama, LimeWire malware roulette, Kazaa, Soulseek |
| `mud` | `--pack=mud` | 7 | MUD login, combat, TradeWars 2002, Circle, LPMud |
| `phreaking` | `--pack=phreaking` | 6 | Blue box 2600 Hz, red box, beige box, war dialers, pay phone exploits |
| `aol` | `--pack=aol` | 6 | AOL progz, chat rooms, punters, keywords, "welcome, you've got mail" |
| `console` | `--pack=console` | 6 | NES cartridge blow, NES glitch crash, SNES mode 7, Genesis blast processing |
| `bbs` | `--pack=bbs` | 5 | BBS login, WWIV, mIRC channels, ANSI art, fidonet |
| `cinema` | `--pack=cinema` | — | reserved for future growth |
| `cartoons` | `--pack=cartoons` | 1 | TMNT sewer HQ (more welcomed) |
| `all` | `--pack=all` | 157 | Every scene (default if no `--pack` flag) |

Totals: **157 scenes** (101 theater + 53 data + 3 event-triggered). Pack counts sum to 157 minus the hidden `konami_winner` scene which sits outside any pack and is only reachable via the konami easter egg.

### 5.2 Data vs theater split

| Type | Count | Behavior |
|------|-------|----------|
| `data` | 53 | Scene `frame` includes `{placeholders}` resolved from `SessionData` via `data_map`. Content adapts to your live session. |
| `theater` | 101 | Scene `frame` is static text (with possible tick-based effect animation). Session data is irrelevant. |
| event-triggered | 3 | `core_kernel_panic`, `events_seckc_upcoming`, `events_seckc_today`. Appear in rotation only when specific conditions are met. |

### 5.3 Special scenes

- `konami_winner` — hidden scene, only reachable by entering the konami code (see §9b.2). Plays a one-off "you win nothing" reveal.
- `core_kernel_panic` — force-pinned when context ≥ 98 %. Not shown in normal rotation unless the trigger fires.
- `events_seckc_upcoming` — added to rotation pool only when `--events=seckc` is enabled AND the next SecKC event is within 7 days.
- `events_seckc_today` — force-pinned when `--events=seckc` enabled AND today is a SecKC event day.

## 6. Data pipeline

### 6.1 Source 1: Claude Code stdin JSON

Same as v1. Claude Code pipes a JSON blob to the statusline on every invocation. Read `process.stdin` with a 50 ms timeout; bad JSON or missing fields → empty `SessionData`, theater scenes still render fine.

### 6.2 Source 2: transcript JSONL tail-read

Same as v1. Backwards-seeking `fs.read` on a small window to find the most recent `{type: "assistant"}` entry and extract `message.usage` for input/output/cache_read/cache_write token counts. Budget: < 10 ms on 100 MB transcripts.

### 6.3 Source 3: git via execFile

Same as v1. `rev-parse --abbrev-ref HEAD`, `status --porcelain=v1`, `rev-list --count --left-right @{u}...HEAD`. Wrapped in `execFile` with 200 ms timeout. Non-git dir → `git: null`.

### 6.4 Pricing calculator

Same as v1. `data/pricing.ts` with a lookup table for Opus 4.6 / Sonnet 4.6 / Haiku 4.5 including context window maxes. Unknown models → Sonnet-rate fallback + stderr warning.

### 6.5 Data resolver (NEW — for scene templates)

The JSON scene contract uses `data_map` to declare how `{placeholders}` in the `frame` template map to session data. Values are dotted paths into a canonical `ResolvedData` tree:

```ts
// ResolvedData tree shape — what the resolver walks
{
  model: 'opus-4.6',                // scene says "data_map.model": "model"
  model_id: 'claude-opus-4-6',
  cost: '$0.42',                    // pre-formatted for display
  cost_raw: 0.4247,                 // number if the scene wants to do its own formatting
  context: '38%',
  context_pct: 38,
  context_used: 76000,
  context_total: 200000,
  ctx_bar: '████░░░░',              // pre-rendered progress bar
  git: 'feat/ink-port',
  git_branch: 'feat/ink-port',
  git_dirty: true,
  model_partial: '▓p█s-4.▓',        // for the decrypt scene (tick-dependent!)
  cost_partial: '$0.▓2',
  ctx_partial: '3▓',
  git_partial: 'f██t/ink-port',
  events: {
    seckc: {
      next: {
        title: 'SecKC - April 2026',
        location: '701 N Montgall KC MO',
        days_until: 7,
        time_local: '18:00'
      }
    }
  }
}
```

Resolver (`data/resolver.ts`) signature:

```ts
export function resolveDataPath(tree: ResolvedData, path: string): string {
  // Walks dotted path: 'events.seckc.next.title' → tree.events.seckc.next.title
  // Missing path → '—' (em-dash as safe placeholder)
  // Non-string value → String(v)
}

export function applyDataMap(frame: string, dataMap: Record<string, string>, tree: ResolvedData): string {
  return frame.replace(/\{(\w+)\}/g, (_, key) => {
    const path = dataMap[key];
    if (!path) return `{${key}}`;   // no mapping → leave placeholder visible (contributor bug)
    return resolveDataPath(tree, path);
  });
}
```

**Tick-dependent fields** like `model_partial` are regenerated on every render as a function of `tick` — that's how the `core_decrypt` scene animates: same scene JSON, but the `{model_partial}` token resolves to a progressively-decrypted string as `tick` advances. The resolver signature gets `tick` as an optional third argument for these.

### 6.6 Budget

Total hot-path budget: **< 40 ms** on a warm filesystem.

| Step | Budget |
|------|--------|
| stdin JSON parse | < 2 ms |
| scenes.json load + parse (~85 KB) | < 5 ms (cached after first parse if engine is long-lived; fresh each invocation in practice) |
| transcript tail-read | < 10 ms |
| git (3 parallel subprocesses) | < 20 ms |
| pricing calc + resolved data tree build | < 2 ms |
| events cache read | < 2 ms |
| rotation select | < 1 ms |
| scene interpret + effect apply | < 5 ms |
| stdout write + state.json write | < 2 ms |

Cold-start overhead on top (Node + module load): ~40–60 ms on M1. Total wall-clock: < 100 ms typical, < 150 ms worst case.

## 7. Rotation engine

### 7.1 Tick derivation

Same as v1. `tick = floor(Date.now() / 120ms)`. Wall-clock pacing.

### 7.2 Scene selection

```ts
// rotation/select.ts
export function selectScene(ctx: SelectContext, library: SceneLibrary): Scene {
  // 1. Triggers (first match wins, may pin across invocations)
  const forced = evaluateTriggers(ctx, library);
  if (forced) return forced;

  // 2. Build pool from library based on config
  const pool = buildPool(library, {
    packs:   ctx.enabledPacks,      // --pack=core,warez,...
    scenes:  ctx.sceneAllowlist,    // --scenes=x,y,z
    exclude: ctx.sceneExclusions,   // --exclude=x,y
    events:  ctx.enabledProviders,  // --events=seckc
    data:    ctx.data,              // needed to check event scene availability
  });
  if (pool.length === 0) return library.scenes.find(s => s.id === 'core_matrix_rain')!; // safe fallback

  // 3. Deterministic cycle through pool
  const cycleSeconds = ctx.cycleSeconds ?? 20;
  const index = Math.floor(ctx.now / 1000 / cycleSeconds) % pool.length;
  return pool[index];
}
```

### 7.3 Pool building (NEW — pack-aware)

```ts
// rotation/pools.ts
export function buildPool(library: SceneLibrary, opts: PoolOpts): Scene[] {
  let pool = library.scenes;

  // Drop the hidden konami scene — only reachable via the easter egg
  pool = pool.filter(s => s.id !== 'konami_winner');

  // Pack filter: default is 'all'; otherwise keep only scenes whose pack is enabled
  if (opts.packs && opts.packs.length > 0 && !opts.packs.includes('all')) {
    pool = pool.filter(s => opts.packs!.includes(s.pack));
  }

  // --scenes allowlist
  if (opts.scenes && opts.scenes.length > 0) {
    pool = pool.filter(s => opts.scenes!.includes(s.id));
  }

  // --exclude
  if (opts.exclude && opts.exclude.length > 0) {
    pool = pool.filter(s => !opts.exclude!.includes(s.id));
  }

  // Event-triggered scenes only appear if the provider is enabled AND condition met
  pool = pool.filter(s => {
    if (s.id.startsWith('events_seckc_')) {
      if (!opts.events?.includes('seckc')) return false;
      const ev = opts.data?.events?.seckc?.next;
      if (!ev) return false;
      if (s.id === 'events_seckc_today')    return ev.days_until === 0;
      if (s.id === 'events_seckc_upcoming') return ev.days_until > 0 && ev.days_until <= 7;
    }
    // core_kernel_panic is normally suppressed and only reached via trigger override
    if (s.id === 'core_kernel_panic') return false;
    return true;
  });

  return pool;
}
```

### 7.4 Triggers (unchanged behavior, updated scene ids)

```ts
// rotation/triggers.ts — priority order, first match wins
const TRIGGERS: Trigger[] = [
  // context pressure escalation
  { id: 'ctx-critical', when: d => d.context.pct >= 98, force: 'core_kernel_panic',    durationSeconds: 60 },
  { id: 'ctx-overflow', when: d => d.context.pct >= 90, force: 'core_buffer_overflow', durationSeconds: 40 },
  { id: 'ctx-decrypt',  when: d => d.context.pct >= 75, force: 'core_decrypt',         durationSeconds: 30 },
  { id: 'ctx-crack',    when: d => d.context.pct >= 50, force: 'core_base64',          durationSeconds: 30 },

  // cost pressure
  { id: 'cost-pwned',   when: d => d.cost.totalUsd >= 10, force: 'core_msf',           durationSeconds: 90 },
  { id: 'cost-warn',    when: d => d.cost.totalUsd >=  5, force: 'core_msf',           durationSeconds: 30 },

  // state change (requires previous-render memory)
  { id: 'branch-swap',  when: d => branchChanged(d),     force: 'core_syn_ack',        durationSeconds: 10 },
  { id: 'model-swap',   when: d => modelChanged(d),      force: 'core_matrix_rain',    durationSeconds: 10 },

  // event proximity (only fire if --events=seckc enabled)
  { id: 'seckc-today',  when: d => daysUntilNext(d, 'seckc') === 0, force: 'events_seckc_today',    durationSeconds: 300 },
  { id: 'seckc-soon',   when: d => daysUntilNext(d, 'seckc') <= 1,  force: 'events_seckc_upcoming', durationSeconds: 120 },
];
```

**Pinning** is unchanged: matched triggers write `{ triggerId, pinnedUntil }` to `state.json`; subsequent invocations within the pin window replay the forced scene. Scene ids now match the JSON library.

### 7.5 Persistent state

`~/.cache/hakcer-statusline/state.json` schema grows slightly to accommodate special modes:

```json
{
  "lastBranch":     "feat/ink-port",
  "lastModel":      "claude-opus-4-6",
  "activeOverride": { "triggerId": "ctx-overflow", "pinnedUntil": 1776204123456 },
  "konamiBuffer":   ["up", "up", "down"],
  "konamiExpires":  1776204200000,
  "screensaverIdleSince": 1776204000000,
  "motdLastRotated":      1776200000000
}
```

## 8. Event providers

Unchanged from v1 design. SecKC implementation and background refresh pattern stay the same. The scenes `events_seckc_upcoming` and `events_seckc_today` are now declared in `scenes.json` with `data_map` entries pointing at `events.seckc.next.*` dotted paths, which the resolver (§6.5) walks.

## 9. Render pipeline

The scene interpreter is the central new component in v2.

### 9.1 Interpreter (`render/interpret.ts`)

```ts
export function interpretScene(scene: Scene, ctx: RenderContext, library: SceneLibrary): string {
  // 1. Substitute {tokens} in frame from data_map
  const substituted = applyDataMap(scene.frame, scene.data_map ?? {}, ctx.resolvedData, ctx.tick);

  // 2. Resolve separator (scene.sep or pack default)
  const sepChar = resolveSeparator(scene, library);

  // 3. Resolve icons/glyphs (scene.icons → codepoints with font fallback)
  const withIcons = injectGlyphs(substituted, scene.icons ?? [], ctx.fontCaps);

  // 4. Apply palette coloring
  const palette = library.palettes[scene.palette];
  const colored = applyPalette(withIcons, palette, ctx.tick);

  // 5. Pick effect (scene.effect → pack default → library default)
  const effectId = scene.effect ?? library.packs[scene.pack].effect ?? 'scanline';
  const effectFn = library.effects[effectId];
  const animated = applyEffect(colored, effectFn, ctx.tick);

  return animated;
}
```

### 9.2 Palette resolution (`render/palette.ts`)

Each palette in `scenes.json` has `bg`, `fg`, `accent`, and pack-specific extras (`glow`, `highlight`, `frost`, `top`, `leo`/`raph`/`donnie`/`mikey` for TMNT, etc.). The resolver:

1. Looks up the scene's `palette` in `library.palettes`.
2. If `--palette=<override>` is set, uses that instead.
3. Builds a `PaintFns` closure (`fg`, `accent`, `gradient`, `bold`, `dim`, `inverse`, `glitch`) bound to the resolved colors.
4. Palette colors are strings — either hex (`#00ff41`) or ANSI256 (`48`). The resolver handles both.

### 9.3 Separator resolution (`render/separator.ts`)

Scenes reference `sep: "arrow"`. The library's `separator_map` maps `"arrow"` to a powerline glyph or fallback char. The resolver returns the actual character based on font capability:

```ts
// separator_map entries + glyph_registry.powerline_separators are joined here
const SEP_CHARS = {
  arrow:    { nerd: '\ue0b0', fallback: '>' },
  arrow_thin: { nerd: '\ue0b1', fallback: '>' },
  round:    { nerd: '\ue0b4', fallback: ')' },
  diagonal: { nerd: '\ue0bc', fallback: '/' },
  pixel:    { nerd: '█',      fallback: '█' },    // block is always safe
  hexagon:  { nerd: '\ue0b6', fallback: '<' },
  flame:    { nerd: '\ue0c0', fallback: '~' },
  lego:     { nerd: '⬛',     fallback: '■' },
  // ...
};
```

### 9.4 Glyph injection (`render/glyph.ts`)

Scene `icons` refer to `glyph_registry` entries (`branch`, `padlock`, `terminal`, `download`, etc.). The injector replaces an optional `{icon:<id>}` token in the frame OR prepends the icons to the output. Missing glyphs (no Nerd Font) fall back to ASCII text replacements.

### 9.5 Effect engine (`render/effects/*.ts`)

Each of the 14 effects is a pure function:

```ts
export type EffectFn = (input: string, tick: number, params?: EffectParams) => string;
```

| Effect | Transformation |
|--------|----------------|
| `scanline` | Horizontal sweep with a bright-line cursor moving across the text |
| `typewriter` | Reveal characters left-to-right, one per N ticks |
| `glitch_corrupt` | Randomly (tick-seeded) replace a fraction of chars with glitch glyphs |
| `phosphor_fade` | Slow color fade on the trailing chars simulating CRT persistence |
| `matrix_drip` | Insert katakana chars between visible chars at random positions |
| `decrypt_reveal` | Cycle chars through cipher glyphs before settling on the final char |
| `color_wave` | Hue rotation across the line, phase shifts with tick |
| `knight_rider` | KITT-style bouncing scanner highlight |
| `crt_boot` | Compressed scanline sweep + a beep indicator |
| `static_noise` | Overlay TV static chars (`░`, `▒`, `▓`) at low density |
| `segment_slide` | Segments (between separators) slide in from the right |
| `heartbeat` | Line pulses bright/dim on a 60 BPM cycle |

**Hakcer effect bridge**: the JSON includes `effects._hakcer_to_statusline_map` mapping the 11 existing hakcer Ink effects (`decrypt`, `colorshift`, `print`, `slide`, `wipe`, `errorcorrect`) to the 14 statusline effects. This lets us reuse existing hakcer effect math where possible; the rest are implemented fresh.

### 9.6 Width handling (unchanged)

`COLUMNS` env > tty columns > 80 fallback.

### 9.7 Compose (safety net, unchanged)

`composeScene` clamps width, guarantees ANSI reset, and never lets a misbehaving scene break the terminal.

## 9b. Special modes (NEW)

Six special modes layer on top of the normal render path. All are opt-in or auto-triggered; none run by default unless enabled.

### 9b.1 Corruption mode (`--corrupt`)

Every Nth frame (default 1 in 50) the output is replaced with one of six glitch messages for exactly one frame, then snaps back. Messages from `special_modes.corruption.messages`:

- `SEGFAULT`
- `KERNEL PANIC - NOT SYNCING`
- `STACK SMASHING DETECTED`
- `GURU MEDITATION`
- `BSOD`
- `ABORT TRAP 6`

Implementation in `modes/corruption.ts`: seeded PRNG keyed on `(session_id, tick)`, advances per invocation, fires when `prng() < 1/50`. Selected message written over the full width with bright red background.

### 9b.2 Konami easter egg

Sequence: `up up down down left right left right b a`.

Implementation:
- The statusline process itself can't read keys (it's a render, not an input loop). Instead, we watch for a **marker file** `~/.cache/hakcer-statusline/konami.trigger` that the user creates by running `hakcer-statusline --konami` in any terminal.
- When the marker is detected, we pin `konami_winner` scene for 60 seconds.
- Alternative trigger (preview mode): if `hakcer-statusline --preview` is running and detects the actual key sequence via stdin raw mode, it sets the trigger file.

State stored in `state.json` as `konamiBuffer[]` and `konamiExpires` timestamp.

### 9b.3 Sound mode (`--sound`)

Opt-in. Each scene can declare a `sound` field (not in v1 scenes, but the schema allows it) or inherit from `special_modes.sound_mode.scene_sounds`. On render, the sound is played via:

- macOS: `afplay <file>` spawned detached
- Linux: `paplay <file>` spawned detached
- Other: no-op

Default: **OFF.** Sound in a statusline is a hostile act — opt-in only. Additional guard: rate-limit to at most one sound per 5 seconds.

### 9b.4 Combo frames (`--combo`)

Smooths the seam when a scene rotates to the next. Instead of a hard swap, the final N frames of scene A blend into the opening N frames of scene B via an overlap/fade. Default off (no combo).

### 9b.5 Screensaver mode (auto, configurable)

Triggers after idle timeout (default 300 s since last render). Behavior from `special_modes.screensaver`:

- Replace statusline with a random banner from `haKCAssets/banners/*.txt` (or a built-in fallback if assets aren't installed)
- Apply one of `[synthgrid, matrix, fireworks, blackhole]` effects
- Snap back to normal rendering on the next render (which implicitly happens when Claude Code calls us again)

Idle tracking uses the delta between `Date.now()` and the last `state.json.lastRenderAt` timestamp. If the delta exceeds the timeout, screensaver mode is active for this render. Disable with `--no-screensaver`.

### 9b.6 MOTD rotation (auto, daily)

From `special_modes.motd_rotation`: a message of the day rotates daily, sourced from a fixed list. Used as a fallback scene when the rotation pool is somehow empty, or when a contributor wants to ship a dated "today in hacker history" fact. Out of scope for v1 implementation — the field is read but no-op unless a source is specified.

### 9b.7 Mode ordering

Modes are applied in the render pipeline in this order:

1. Normal scene render (via `interpretScene`)
2. `combo` blending with previous frame (if enabled)
3. `screensaver` override (if idle)
4. `corruption` override (if enabled and PRNG fires)
5. `konami` force-pin (if marker file is active)
6. `compose` width clamp + reset

Corruption can override combo output; konami can override corruption. Konami wins.

## 9c. Font policy (NEW)

Nerd Fonts are recommended but not required.

### 9c.1 Capability detection (`render/font-detect.ts`)

At startup, check in this order:
1. Env var `HAKCER_STATUSLINE_NERD_FONT=1` → assume Nerd Font support
2. Env var `TERM_PROGRAM=iTerm.app|Alacritty|kitty|WezTerm` → high confidence
3. Env var `LC_TERMINAL=iTerm2` → confidence
4. Otherwise → conservative fallback mode (no Nerd Font glyphs)

Detection result stored in `ctx.fontCaps` and consulted by `separator.ts`, `glyph.ts`, and `font_logos` resolution.

### 9c.2 Fallback registry

Every glyph has an ASCII fallback. When `fontCaps.nerdFont === false`:

| Glyph | Nerd | Fallback |
|-------|------|----------|
| OS logo (Alpine) | `\uf300` | `[alpine]` |
| OS logo (Arch)   | `\uf303` | `[arch]` |
| WM (awesome)     | `\uf354` | `[wm]` |
| powerline arrow  | `\ue0b0` | `>` |
| powerline branch | `\ue0a0` | `⌥` or `B:` |

Fallbacks defined alongside the glyph registry in `scenes.json` (a new `fallback` key per glyph).

### 9c.3 `--install-fonts` command

```
hakcer-statusline --install-fonts
```

Implementation in `fonts/install.ts`:
1. Check current font capability. If already enabled, say "Nerd Font already detected" and exit.
2. Detect OS (macOS / Linux).
3. Offer to install **JetBrains Mono Nerd Font** (MIT license, widely compatible, default choice).
4. On macOS: `brew install --cask font-jetbrains-mono-nerd-font` if Homebrew exists, else download from the ryanoasis/nerd-fonts GitHub release to `~/Library/Fonts/`.
5. On Linux: download to `~/.local/share/fonts/` and run `fc-cache -f`.
6. Print next steps: "Set your terminal font to JetBrains Mono Nerd Font and reload your statusline."

Requires explicit user invocation. Not a post-install script. Not automatic. Not silent.

### 9c.4 README guidance

```markdown
## Fonts

hakcer-statusline looks best with a Nerd Font. It works without one
(glyphs fall back to ASCII), but you'll miss out on OS logos, powerline
separators, and icon glyphs.

Install the recommended font:

    hakcer-statusline --install-fonts

Or manually:

    # macOS
    brew install --cask font-jetbrains-mono-nerd-font

    # Linux (arch)
    yay -S ttf-jetbrains-mono-nerd
```

## 10. CLI surface

```
Usage:
  hakcer-statusline [options]                       # normal mode (Claude Code calls this)
  hakcer-statusline --preview [scene]               # dev: tight loop, clears + redraws
  hakcer-statusline --list [--pack <id>]            # list all scene ids + verbs + themes
  hakcer-statusline --list-packs                    # list all 19 packs with scene counts
  hakcer-statusline --list-palettes                 # list all 20 palettes
  hakcer-statusline --explain                       # dump stdin JSON payload (debug)
  hakcer-statusline --debug                         # normal mode + stderr timing/diagnostics
  hakcer-statusline --install-fonts                 # download + install JetBrains Mono Nerd Font
  hakcer-statusline --konami                        # trigger the konami easter egg

Filter flags:
  --pack <csv>           Enable only these packs (default: all).
                         Example: --pack=core,warez,phreaking,2600
  --scenes <csv>         Only use these scene ids in rotation
  --exclude <csv>        Exclude these scene ids
  --palette <id>         Override scene's canonical palette (one of 20)
  --events <csv>         Enable event providers: seckc (default: none; 'off' to disable+purge)
  --cycle-seconds <n>    Rotation cadence (default 20)

Effect & behavior flags:
  --scene <id>           Pin one scene, no rotation (for screenshots)
  --effect <id>          Override the scene's effect (one of 14)
  --no-git               Skip git subprocesses (saves ~15ms in non-git dirs)
  --width <n>            Force width (default: detect from COLUMNS/tty/80)

Special modes:
  --corrupt              Enable corruption mode (1-in-50 frame glitch flash)
  --sound                Enable per-scene sound mode (opt-in)
  --combo                Enable combo frame blending across scene boundaries
  --no-screensaver       Disable idle-timeout screensaver
  --konami-off           Disable the konami easter egg

Info:
  --version              Print version
  --help                 Print this text
```

## 11. Testing strategy

### 11.1 Library integrity tests

`__tests__/library.test.ts` — runs once per test suite startup:

1. Parses `scenes.json` with a strict schema validator (`ajv` against [scenes.schema.json](ink/source/statusline/data/scenes.schema.json)).
2. Every scene `id` is unique.
3. Every scene's `pack`, `palette`, and `sep` reference an existing entry.
4. Every `icons` entry references an existing glyph.
5. Every `data_map` key resolves to a non-empty dotted path.
6. Every placeholder in `frame` (matching `/\{(\w+)\}/`) has a `data_map` entry (for data scenes) or the scene is theater.

### 11.2 Scene invariant matrix

`__tests__/scenes.test.ts` — parameterized over all 157 scenes × widths `{60, 80, 120, 200}` × ticks `{0, 50, 150, 300}`:

1. `stripAnsi(rendered).length <= width`
2. No `\n` in output
3. ANSI sequences balanced
4. No `NaN`, `undefined`, `[object Object]` substrings
5. Render < 5 ms (warning), hard fail at 20 ms
6. Deterministic: same `(scene, tick, width, data)` → identical output

Approximately 157 × 4 × 4 = 2512 scene cells; each cell checks 6 invariants → ~15k assertions. Runs in CI in < 5 s because each assertion is a pure function call.

### 11.3 Interpreter tests

`__tests__/interpret.test.ts`:
- Template substitution (placeholders → data)
- Dotted-path resolver with nested objects
- Missing-data fallback to em-dash
- Palette resolution for every palette in `palettes`
- Separator fallback when `fontCaps.nerdFont === false`

### 11.4 Rotation tests

Same matrix as v1 — trigger priority, pinning, pool filtering — plus:
- Pack filtering (`--pack=warez` excludes non-warez scenes)
- Event scene filtering (`events_seckc_*` gated on `--events=seckc` AND data availability)
- Konami marker file detection
- Screensaver idle timeout

### 11.5 Mode tests

`__tests__/modes.test.ts`:
- Corruption PRNG fires at expected rate (statistical: 10,000 ticks → ~200 corruption frames ± tolerance)
- Konami key buffer matches partial sequences
- Screensaver idle detection
- Mode ordering (konami beats corruption beats screensaver beats combo)

### 11.6 Data suite (unchanged from v1)

Transcript tail-read, pricing, cache TTL, provider JSON parsing.

### 11.7 Font detection tests

`__tests__/font-detect.test.ts` — parameterized env fixtures:
- `TERM_PROGRAM=iTerm.app` → nerdFont=true
- `TERM_PROGRAM=Terminal.app` → nerdFont=false
- `HAKCER_STATUSLINE_NERD_FONT=1` → always true (override)

### 11.8 Integration smoke test

One test wires the full `main()` with mocked stdin, fixture transcript, `--scene=core_matrix_rain`, asserts the output is a single styled line ≤ 120 chars.

## 12. Security & privacy

Unchanged from v1 except:

**Special mode additions:**
- `--sound` spawns `afplay`/`paplay` as detached children. Only triggers on whitelisted scene sound file paths embedded in the library; no user-supplied paths. Sound files (if any) live in the `hakcer` package and are shipped with it.
- `--konami` writes to `~/.cache/hakcer-statusline/konami.trigger` (a timestamp file). Read-only to the statusline render path.
- `--install-fonts` is the only network action other than event providers. Downloads from `github.com/ryanoasis/nerd-fonts/releases/` — a well-known source. User must explicitly invoke; never automatic.

**Security-auditor review gate** remains mandatory before merge, per [CLAUDE.md](CLAUDE.md) §Security Rules.

## 13. Demo page + README showcase

Pivot from per-scene to per-pack tapes because 157 scenes × individual tapes is absurd.

### 13.1 Required VHS tapes

```
ink/statusline/demos/tapes/
├── _hero.tape                 # 19-pack carousel, 2s each pack → 38s hero loop
├── pack_core.tape             # all 24 core scenes cycling
├── pack_warez.tape            # all 8 warez scenes cycling
├── pack_phreaking.tape        # all 6 phreaking scenes cycling
├── pack_aol.tape              # all 6 aol scenes cycling
├── pack_p2p.tape              # all 7 p2p scenes cycling
├── pack_bbs.tape              # all 5 bbs scenes cycling
├── pack_2600.tape             # all 10 2600 scenes cycling
├── pack_mud.tape              # all 7 mud scenes cycling
├── pack_movies.tape           # all 15 movies scenes cycling
├── pack_toys.tape             # all 12 toys scenes cycling
├── pack_arcade.tape           # all 9 arcade scenes cycling
├── pack_console.tape          # all 6 console scenes cycling
├── pack_dos.tape              # all 12 dos scenes cycling
├── pack_early_web.tape        # all 9 early_web scenes cycling
├── pack_trikc.tape            # all 10 trikc scenes cycling
├── pack_tv80s.tape            # all 10 tv80s scenes cycling
├── trigger_ctx_overflow.tape  # buffer-overflow scene triggered by ctx ≥ 90%
├── trigger_cost_pwned.tape    # msf scene triggered by cost ≥ $5
├── trigger_kernel_panic.tape  # kernel-panic triggered by ctx ≥ 98%
├── mode_corruption.tape       # corruption flash demonstration
├── mode_konami.tape            # konami_winner reveal
├── mode_screensaver.tape       # idle timeout screensaver
├── palette_showcase.tape       # one reference scene through all 20 palettes
└── event_seckc.tape           # events_seckc_upcoming scene
```

Per-pack tapes are cheap: each runs `hakcer-statusline --preview --pack=<name>` and lets the rotation cycle through the pack's scenes for 30–60 s.

### 13.2 README structure

- Hero GIF (pack carousel)
- Install snippet (npm + settings.json)
- Pack gallery: 19 packs, each with a link to its dedicated GIF and a one-line description
- Reactive triggers table with trigger-demo GIFs
- Special modes section with mode-demo GIFs
- Palette showcase
- Event providers (opt-in)
- Nerd Font recommendation + `--install-fonts`
- Contributing link

### 13.3 GIF hosting, CI, pages site

Unchanged from v1: orphan `demos` branch, VHS-action CI workflow, plain HTML + static GIFs at `/docs/`.

## 14. Risks + open questions

1. **scenes.json size growth.** 85 KB today with 157 scenes. Linear growth per contribution. At 500 scenes it's ~250 KB — still fine for a one-time read per invocation. If/when it becomes a problem, we split by pack into `scenes/<pack>.json` files. Not pre-optimizing.

2. **Template format freezing.** The `{placeholder}` + `data_map` dotted path format is now a public contract. Breaking changes require a JSON schema version bump (`meta.schema_version`) and a migration script for contributor forks.

3. **Nerd Font detection reliability.** Our env-based sniff is a heuristic. It may say "yes" when the user's chosen font doesn't actually have Nerd glyphs, producing box-drawing garbage. Mitigation: `HAKCER_STATUSLINE_NERD_FONT=0` override for users, and a one-liner in `--debug` output: *"font capability: nerd (iTerm), override with HAKCER_STATUSLINE_NERD_FONT=0"*.

4. **Effect animation quality.** 14 effects is a lot to implement well. Some are easy (`typewriter`, `scanline`), others are hard (`phosphor_fade`, `matrix_drip`). **Mitigation:** implement the easy ones first and ship v1 with 5–6 working effects, stub the others as pass-through until v1.1. Every scene still renders (just without the specific effect animation).

5. **Konami detection mechanism.** The marker-file approach works but is clunky. It only triggers when the user runs `hakcer-statusline --konami` in a separate shell. Proper key detection would require an always-on daemon, which is out of scope. We accept the limitation.

6. **Screensaver idle timeout.** 300 s since last render is approximate — Claude Code might not call us often in a slow session, and we can't distinguish "user idle" from "Claude thinking." Mitigation: tune the timeout post-launch based on feedback; start at 300 s.

7. **Sound mode legal/privacy.** Playing sounds during a dev tool could be disruptive in shared spaces. **Mitigation:** off by default, opt-in only, rate-limited. README warns explicitly.

8. **Unknown model pricing** — same as v1.

9. **License: scenes.json** — pure data, MIT-licensed as part of the hakcer package. No scene content is copyrighted (short references, parody, fair use).

10. **Content review.** Some scenes reference real brands/people (Metallica, Lars Ulrich, etc.) as parody. If any party objects, the scene in question is removed by JSON PR. No code change required.

11. **Claude Code JSON schema drift** — same as v1.

12. **Cold-start time** — same as v1.

## 15. v1 scope summary

**In:**
- `hakcer-statusline` bin in the existing Ink package
- Full `ink/source/statusline/` tree per §3.1
- `ink/source/statusline/data/scenes.json` — 157 scenes, 19 packs, 20 palettes, 14 effects, 6 special modes (already committed as [9eb0fad](https://github.com/NoDataFound/hakcer/commit/9eb0fad))
- Scene JSON schema + validator (`scenes.schema.json` + `ajv` at test time)
- Scene interpreter (`render/interpret.ts`) with template substitution, palette apply, separator resolution, glyph injection
- Effect engine with **at minimum 6 working effects** in v1: `typewriter`, `scanline`, `glitch_corrupt`, `color_wave`, `matrix_drip`, `static_noise`. Remaining 8 effects stub as pass-through with a test-suite exclusion comment. v1.1 fills them in.
- Data pipeline (stdin, transcript, git, pricing, dotted-path resolver, events cache)
- Rotation engine with pack filtering + all triggers
- Special modes: `corruption`, `screensaver`, `konami` (via marker file). `sound`, `combo`, `motd` stubbed but disabled — hooks exist, no implementation, flag errors out with "not yet implemented in v1."
- Event providers: SecKC (opt-in)
- CLI surface per §10
- Preview mode, `--list`, `--list-packs`, `--list-palettes`, `--explain`, `--debug`, `--install-fonts`
- Font detection + fallback registry
- Full test suite per §11
- `CONTRIBUTING.md` sections for adding scenes, packs, palettes, and providers (all JSON edits)
- README showcase per §13.2
- Plain HTML demo page at `/docs/`
- CI workflow for VHS GIF regeneration (per-pack tapes)
- Pricing table for Opus 4.6 / Sonnet 4.6 / Haiku 4.5

**Out:**
- 8 of 14 effects (stubbed, deliver in v1.1)
- `sound` mode (flag errors; v1.1)
- `combo` mode (flag errors; v1.1)
- `motd` rotation source (stub; v1.1 or later)
- TOML / YAML config
- Starship passthrough
- Windows PowerShell
- Multi-line statuslines
- User-local `~/.config/hakcer-statusline/scenes.json` override
- Additional event providers beyond SecKC (welcomed as contributions post-merge)
- Live JS browser recreation on the demo page
- Custom domain
- Telemetry
- Rust rewrite

## 16. Success criteria

1. `hakcer-statusline` installs with `npm i -g hakcer` and works via one line in `settings.json`.
2. Cold-start render time < 150 ms on an M1 (target < 100 ms with the full JSON load).
3. All 157 scenes pass the library integrity suite (`library.test.ts`) and the scene invariant matrix (`scenes.test.ts`).
4. All 19 packs can be selected individually via `--pack=<id>`, producing a non-empty rotation pool filtered to that pack.
5. Adding a new scene is a single JSON object edit with zero TypeScript changes, and CI validates the addition automatically.
6. `--events=seckc` produces a cached `events.json` on first run and fires `events_seckc_upcoming` when an event is within 7 days (verified by manual test with fixture data).
7. All trigger rules in §7.4 fire correctly (verified by rotation test suite).
8. At least 6 of 14 effects render distinguishable output (verified by snapshot diff between `--effect=typewriter` and `--effect=scanline` on the same scene).
9. `corruption`, `screensaver`, and `konami` modes work end-to-end.
10. Nerd Font detection correctly falls back on a vanilla Terminal.app and renders without `?` boxes.
11. README renders GIFs from the `demos` branch on GitHub.
12. `security-auditor` subagent sign-off on the implementation PR.
13. Zero network calls in the default configuration.

---

## Appendix A — scenes.json top-level shape (canonical reference)

```json
{
  "meta": {
    "name": "hakcer-statusline-master",
    "version": "1.0.0",
    "description": "Complete scene library...",
    "scene_count": 157,
    "pack_count": 19,
    "theme_count": 28,
    "effect_count": 12
  },
  "glyph_registry": {
    "powerline_separators": { ... },
    "powerline_symbols":    { ... },
    "nerd_font_icons":      { ... },
    "block_elements":       { ... },
    "box_drawing":          { ... }
  },
  "font_logos": {
    "auto_detect_os": { "method": "...", "position": "leftmost_segment", "map": { "alpine": "0xF300", ... } },
    "auto_detect_wm": { "method": "...", "map": { "awesome": "0xF354", ... } },
    "scene_overrides": { "msf_*": "0xF327", ... }
  },
  "palettes": {
    "_existing_hakcer_themes": [ ... ],
    "amber_crt":     { "bg": "...", "fg": "...", "accent": "...", "glow": "..." },
    "green_phosphor":{ ... },
    "kali_red":      { ... },
    ...  // 20 total
  },
  "separator_map": {
    "core": "arrow", "warez": "pixel", "phreaking": "hexagon", ...  // 18 total
  },
  "effects": {
    "scanline":      { "type": "...", "speed": "...", "desc": "..." },
    "typewriter":    { ... },
    ...  // 14 total
    "_hakcer_to_statusline_map": { "decrypt": "...", "colorshift": "...", ... },
    "_no_statusline_translation": [ ... ]
  },
  "special_modes": {
    "corruption":        { "flag": "--corrupt", "frequency": "1 in 50 frames", "messages": [ ... ] },
    "konami_easter_egg": { "trigger": "up up down down left right left right b a", "hidden_scene_id": "konami_winner" },
    "sound_mode":        { "flag": "--sound", ... },
    "combo_frames":      { ... },
    "screensaver":       { "trigger": "idle_timeout", "timeout_seconds": 300, "banner_source": "...", "effects": [ ... ] },
    "motd_rotation":     { ... }
  },
  "packs": {
    "core":       { "flag": "--pack=core",       "desc": "..." },
    "warez":      { "flag": "--pack=warez",      "desc": "NFO, keygen, FTP ratio, nuke, courier, XDCC" },
    "phreaking":  { "flag": "--pack=phreaking",  "desc": "..." },
    ...  // 19 total
  },
  "scenes": [
    { "id": "core_matrix_rain", "name": "...", "pack": "core", ... },
    ...  // 157 total
  ]
}
```

All engine modules treat this shape as the canonical source of truth. Schema enforced via [scenes.schema.json](ink/source/statusline/data/scenes.schema.json) and validated in CI.
