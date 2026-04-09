# hakcer-statusline — Design Spec

> **Status:** Draft — approved through brainstorming, pending implementation plan.
> **Date:** 2026-04-08
> **Author:** Cory Kennedy (@NoDataFound) + Claude (brainstorm)
> **Project:** [hakcer-1](https://github.com/NoDataFound/hakcer)
> **Target version:** hakcer@1.3.0

## 1. Summary

A Claude Code statusline that replaces the conventional cost/context/git readout with animated full-width "hacking scenes" — matrix rain, base64 cracking, PCB trace drawing, Metasploit MS08-067 pwning, snake game, etc. Each scene is a different **visual lens** on the same live session data (model, cost, context %, git branch); some scenes weave the data into the scene itself, others are pure theater. Scenes rotate every 20 seconds, but key session events (context ≥ 90 %, cost ≥ $5, branch change) **force** a thematically-appropriate scene to play out for a pinned duration.

The statusline ships inside the existing `hakcer` Ink package as a second CLI bin (`hakcer-statusline`), wired into `~/.claude/settings.json`. Scenes are pure TypeScript functions auto-discovered from `ink/source/statusline/scenes/`, so adding a new scene is a single-file PR. Event providers (SecKC by default, opt-in) fetch upcoming meetup data on a cached background schedule and fire dedicated scenes when events are imminent.

### Primary goals

1. Ship a daily-driver statusline that is visually unique to `hakcer` and not confusable with cship or levz0r.
2. Double as marketing for the `hakcer` package — screenshots and GIFs should sell it.
3. Make scene contribution trivial: one TypeScript file in a known folder, one PR, reviewed, merged.
4. Reactive session-state behavior (triggers) is the single most distinctive feature.

### Non-goals (v1)

- TOML / YAML config files (flags only).
- Starship passthrough modules.
- Windows PowerShell support.
- Multi-line statuslines.
- Custom user-local scenes outside the package (e.g., `~/.config/hakcer-statusline/scenes/`).
- Telemetry of any kind.
- Rust rewrite for sub-10ms speed.

## 2. Context and prior art

| Project | Stars | Language | What we take from it |
|---------|-------|----------|----------------------|
| [stephenleo/cship](https://github.com/stephenleo/cship) | 312 | Rust | Module system, context progress bar concept, warn/critical threshold idea, Claude Code JSON stdin protocol |
| [levz0r/claude-code-statusline](https://github.com/levz0r/claude-code-statusline) | 1 | Bash | Transcript JSONL tail-read pattern, per-model pricing math (Opus/Sonnet/Haiku), input + cache_read + cache_write + output token decomposition |
| [epidemian/snake](https://github.com/epidemian/snake) | 1,381 | JS | Constraint model: playable "game" feel in a single-line braille-rendered canvas |
| [charmbracelet/vhs](https://github.com/charmbracelet/vhs) | — | Go | Terminal demo recording for README / docs GIFs |

**What we do that neither cship nor levz0r does:** animated scenes replace the data readout (scenes *are* the statusline), and the statusline reacts to session state with thematically appropriate scene overrides.

**Existing hakcer assets reused:**
- [ink/source/effects/](ink/source/effects/) — 11 pure-function effects (matrix, decrypt, glitch, etc.) that already return `{ lines: string[], done: boolean }` per tick. No React/Ink runtime required to call them.
- [ink/source/themes.ts](ink/source/themes.ts) — 9 canonical themes (matrix, neon, synthwave, amber, ice, fire, cyber, mono, pastel) + 2 new themes (bloodred, kali) added for this project.
- [ink/source/colors.ts](ink/source/colors.ts) — ANSI helpers.

## 3. Architecture

### 3.1 File layout

```
ink/source/statusline/
├── cli.ts                 # bin entry — invoked via `npx hakcer-statusline`
├── main.ts                # orchestrator: parse flags → read stdin → pick scene → render → write → exit
├── types.ts               # Scene, SceneContext, SessionData, ThemeName, PaintFns
│
├── data/
│   ├── parse-stdin.ts     # read Claude Code JSON payload from process.stdin (50ms timeout)
│   ├── transcript.ts      # tail-read transcript .jsonl, extract token usage from last assistant turn
│   ├── pricing.ts         # per-model cost calc + context window maxes (Opus / Sonnet / Haiku)
│   ├── git.ts             # branch, ahead/behind, dirty flag via execFile (200ms timeout)
│   └── providers/
│       ├── index.ts       # codegen'd auto-import of all providers
│       ├── types.ts       # EventProvider, UpcomingEvent interfaces
│       ├── _template.ts   # contributor template
│       └── seckc.ts       # Squarespace JSON scraper for https://www.seckc.org/upcoming-events
│
├── rotation/
│   ├── select.ts          # scene picker: forced triggers → deterministic time-based pool index
│   ├── triggers.ts        # event rule evaluation, priority order, pinning logic
│   └── tick.ts            # deterministic tick from Date.now() / FRAME_MS
│
├── render/
│   ├── paint.ts           # paint(text, theme, gradient?) → ANSI string (kleur-backed)
│   ├── width.ts           # terminal width detection (COLUMNS > tty > 80)
│   └── compose.ts         # scene.render(ctx) + width clamp + ANSI reset safety net
│
├── cache/
│   └── events.ts          # ~/.cache/hakcer-statusline/ cache layer + background refresh spawner
│
├── scenes/
│   ├── index.ts           # codegen'd auto-import of all scenes
│   ├── _template.ts       # contributor template
│   ├── matrix-rain.ts     # data
│   ├── decrypt.ts         # data
│   ├── base64.ts          # data
│   ├── pcb.ts             # data
│   ├── port-scan.ts       # data
│   ├── hakcer-typer.ts    # theater
│   ├── wardial.ts         # theater
│   ├── packet.ts          # theater
│   ├── buffer-overflow.ts # theater
│   ├── snake.ts           # theater
│   ├── ms08-067.ts        # theater
│   ├── kernel-panic.ts    # theater
│   ├── seckc-upcoming.ts  # event-triggered theater
│   └── seckc-today.ts     # event-triggered theater
│
└── __tests__/
    ├── scenes.test.ts
    ├── rotation.test.ts
    ├── transcript.test.ts
    ├── pricing.test.ts
    ├── cache.test.ts
    ├── providers/seckc.test.ts
    └── fixtures/
        ├── transcript.jsonl
        ├── seckc.json
        └── stdin.json

ink/statusline/demos/
├── tapes/                 # VHS .tape files, one per scene + hero + triggers + theme-compare
├── out/                   # generated GIFs (not committed; see §8.2)
├── scripts/
│   ├── record-all.sh
│   └── publish.sh         # force-push GIFs to orphan `demos` branch
└── docs/                  # GitHub Pages source (index.html + css + images)
```

### 3.2 Package wiring

Add a second bin to the existing Ink package:

```json
// ink/package.json
{
  "bin": {
    "hakcer": "dist/cli.js",
    "hakcer-statusline": "dist/statusline/cli.js"
  }
}
```

Install story in the README:

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

The statusline path **bypasses Ink entirely**. Ink has ~300–500 ms cold-start overhead and is designed for persistent frame loops, not one-shot prints. The existing effect functions in [ink/source/effects/](ink/source/effects/) are already pure `(config, tick) => { lines, done }` — they were always callable without a React runtime.

Statusline render path on every Claude Code turn:

1. `cli.ts` imports `main.ts` and calls `main(process.argv)`.
2. `main.ts` parses flags (strict allowlist), reads `process.stdin` with a 50 ms timeout, walks the transcript file, runs git commands, reads the events cache.
3. Rotation engine picks the active scene.
4. `compose.ts` calls `scene.render(ctx)` with the resolved context.
5. `process.stdout.write(line)`.
6. If events cache is stale AND `--events` is enabled, spawn a detached child to refresh it (fire-and-forget).
7. Write updated `state.json` (last branch, last model, active override window).
8. `process.exit(0)`.

Cold-start budget: **< 80 ms on an M1, < 150 ms on older hardware.** Hot path never blocks on network.

## 4. Scene contract

The single most important interface in the project. This is what contributors copy-paste.

```ts
// ink/source/statusline/types.ts

export type ThemeName =
  | 'matrix' | 'neon' | 'synthwave' | 'amber'
  | 'ice'    | 'fire' | 'cyber'     | 'mono' | 'pastel'
  | 'bloodred' | 'kali';

export interface SessionData {
  model:     { id: string; displayName: string };
  cost:      { totalUsd: number; inputTokens: number; outputTokens: number; cacheRead: number; cacheWrite: number };
  context:   { used: number; total: number; pct: number };
  workspace: { dir: string; projectDir: string };
  git:       { branch: string | null; dirty: boolean; ahead: number; behind: number };
  session:   { id: string; startedAt: number };
  events?:   { nextByProvider(id: string): UpcomingEvent | null };
}

export interface SceneContext {
  tick:  number;            // monotonic frame index (wall clock / FRAME_MS)
  width: number;            // terminal columns available
  data:  SessionData;       // live session state
  theme: Theme;             // resolved theme (canonical or --theme override)
  paint: PaintFns;          // helpers: fg, gradient, bold, dim, inverse, glitch
}

export interface Scene {
  id: string;               // kebab-case, unique, used by --scene and --preview
  verb: string;             // uppercase spinner label: 'PWNING', 'DECODING', ...
  theme: ThemeName;         // canonical theme, overridden by --theme=<x>
  carriesData: boolean;     // true = data is woven into the scene, false = pure theater
  durationFrames?: number;  // frames before rotation (default 150 ≈ 18s @ 120ms)

  /** One render call = one frame. Must return a SINGLE line, width ≤ ctx.width, no trailing newline. */
  render(ctx: SceneContext): string;
}
```

### 4.1 Scene invariants (enforced by test suite)

Every scene in `scenes/` must satisfy:

1. `stripAnsi(output).length <= ctx.width` at all tested widths (60, 80, 120, 200).
2. ANSI escape sequences are balanced — no leaked state bleeds into following output.
3. No newlines in output.
4. Deterministic: same `(tick, width, data)` → same output. No `Math.random()` without a seeded PRNG keyed on `tick`.
5. Renders within **5 ms** per frame on CI hardware.
6. Returns an empty string only when `carriesData === false` AND the scene has decided this frame should be blank (not permitted for data scenes).

### 4.2 Auto-discovery (codegen, not runtime)

`scenes/index.ts` and `data/providers/index.ts` are generated at build time by a tiny `tsx` codegen script that scans the respective folders and emits static `import { scene as <camelName> } from './<file>.js'` lines plus an exported `ALL_SCENES` / `ALL_PROVIDERS` array. Benefits:

- Tree-shakable (static imports → esbuild can dead-code-eliminate unused scenes).
- Fast startup (no `fs.readdir` at runtime).
- Lint-friendly (no dynamic `import()` expressions).
- Adding a scene = drop a file + `pnpm build`. Index regenerates automatically.

### 4.3 Contribution flow

Documented in `CONTRIBUTING.md`:

1. `cp ink/source/statusline/scenes/_template.ts ink/source/statusline/scenes/my-scene.ts`
2. Fill in `id`, `verb`, `theme`, `carriesData`, `durationFrames`, `render()`.
3. `pnpm test` — scene test suite validates invariants automatically.
4. `pnpm build && npx hakcer-statusline --preview --scene=my-scene` — see it animate live in your terminal.
5. Record a VHS tape at `ink/statusline/demos/tapes/my-scene.tape` (optional but encouraged — CI will generate the GIF on merge).
6. Open a PR. Security-auditor subagent runs automatically. Merge when green.

## 5. Scene library (v1)

Eleven full-time scenes + one event-triggered scene pair, for 13 scene files total.

### 5.1 Data scenes (the session data is the scene content)

| # | Scene | Verb | Theme | What it shows |
|---|-------|------|-------|---------------|
| 1 | `matrix-rain` | DECODING | matrix | Katakana interference left + right of payload: `ｦ8ｲH opus-4.6ｷ $0.42 ｲ [████░░] 38% ﾑﾒｸ feat/ink-port` |
| 2 | `decrypt` | DECRYPTING | synthwave | Each data character cycles through cipher glyphs then resolves: `▓p█s-4.▓ $0.▓2 [▓███░░] 38▓ f██t/ink-port` |
| 3 | `base64` | CRACKING | cyber | Fake b64 prefix → arrow → decoded payload: `$ b64d Zm9vYmFy... → opus-4.6 $0.42 38% feat/ink-port` |
| 4 | `pcb` | TRACING | neon | Data values as pulsing nodes on a circuit trace: `┌●━opus-4.6━●━$0.42━●━[████░░]━●━38%━●━feat/ink-port━●┐` |
| 5 | `port-scan` | SCANNING | ice | Data disguised as nmap open ports: `nmap claude.ai [opus-4.6✓ $0.42✓ ctx:38%✓ ink:✓]` |

### 5.2 Theater scenes (pure show, session data ignored)

| # | Scene | Verb | Theme | Frame progression |
|---|-------|------|-------|-------------------|
| 6 | `hakcer-typer` | TYPING | matrix | Fake shell commands streaming: `$ sudo ./exploit.sh --target=pentagon.gov --payload=zeroday█` |
| 7 | `wardial` | DIALING | amber | Phreaking handshake: `ATDT867-5309...CONNECT 2400...♪♫ HANDSHAKE ♪♫` |
| 8 | `packet` | HANDSHAKING | neon | TLS 1.3 0-RTT handshake: `[SYN→] [←SYN/ACK] [ACK→] ══ TLS1.3 ══ 0-RTT` |
| 9 | `buffer-overflow` | OVERFLOWING | fire | Memory addresses scrolling → RIP hijack: `0xDEADBEEF → 0xCAFEBABE → 0x1337C0DE → RIP=0x41414141` |
| 10 | `snake` | HUNTING | mono | Braille snake eats pellets and grows, wraps edge: `⠄⠠⠐⢀⠠⠐●⠄⠁⠂⠄⠂o⠁⠠⠂⠄⠐` |
| 11 | `ms08-067` | PWNING | bloodred | msfconsole kill chain (12-frame loop): `msf> use exploit/windows/smb/ms08_067_netapi` → `set RHOST 10.10.10.4` → `exploit` → `[*] Triggering vulnerability...` → `[*] Sending stage (175686 bytes)` → `[+] Meterpreter session 1 opened` → `meterpreter> getuid` → `Server username: NT AUTHORITY\SYSTEM` → `meterpreter> hashdump` |
| 12 | `kernel-panic` | PANICKING | fire | Linux-style panic scrolling: `*** KERNEL PANIC — not syncing: out of context ***  CPU0: 1  PID: 1337  RIP: 0xC0NT3XT` |

### 5.3 Event-triggered scenes (opt-in via `--events`)

| # | Scene | Verb | Theme | Fires when |
|---|-------|------|-------|------------|
| 13a | `seckc-upcoming` | INCOMING | amber | Next SecKC event within 7 days: `📡 SECKC // APR 2026 // 701 N MONTGALL, KC MO // T-3d` |
| 13b | `seckc-today` | TONIGHT | amber | Next SecKC event is today: `▓▒░ SECKC TONIGHT ░▒▓ // 701 N MONTGALL KC MO // GO GO GO` |

## 6. Data pipeline

### 6.1 Source 1: Claude Code stdin JSON

Claude Code pipes a JSON blob to the statusline's stdin on every invocation. Expected shape (schema pinned per Claude Code version, defensively parsed):

```json
{
  "session_id": "abc123...",
  "transcript_path": "/Users/.../.claude/projects/-Users-.../<uuid>.jsonl",
  "model": { "id": "claude-opus-4-6", "display_name": "Opus 4.6" },
  "workspace": { "current_dir": "/Users/0xdeadbeef/hakcer-1", "project_dir": "/Users/..." },
  "version": "...",
  "output_style": { "name": "default" }
}
```

`data/parse-stdin.ts` reads `process.stdin` with a 50 ms timeout. Bad JSON or missing fields → empty `SessionData`, scenes still render (theater scenes are unaffected; data scenes show `—`).

### 6.2 Source 2: transcript JSONL tail-read

Token counts and cost are not in the stdin payload — we compute them from the transcript file. Pattern borrowed from levz0r:

```ts
// data/transcript.ts
export async function readTokenUsage(transcriptPath: string): Promise<TokenUsage> {
  const lastLines = await tailLines(transcriptPath, 50);
  for (const line of lastLines.reverse()) {
    const evt = safeJsonParse(line);
    if (evt?.type === 'assistant' && evt?.message?.usage) {
      return {
        input:      evt.message.usage.input_tokens ?? 0,
        output:     evt.message.usage.output_tokens ?? 0,
        cacheRead:  evt.message.usage.cache_read_input_tokens ?? 0,
        cacheWrite: evt.message.usage.cache_creation_input_tokens ?? 0,
      };
    }
  }
  return { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
}
```

`tailLines` uses backwards-seeking `fs.read` on a small buffer window. Budget: **< 10 ms even on 100 MB transcripts.** Never reads the whole file.

### 6.3 Source 3: git via execFile

```ts
// data/git.ts  — all execFile (not exec), 200 ms timeout per subprocess
execFile('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd, timeout: 200 });
execFile('git', ['status', '--porcelain=v1'],          { cwd, timeout: 200 });
execFile('git', ['rev-list', '--count', '--left-right', '@{u}...HEAD'], { cwd, timeout: 200 });
```

Not a git repo, no upstream, or timeout → `git: null`. No propagated failures.

### 6.4 Pricing calculator

`data/pricing.ts`:

```ts
interface ModelPricing {
  input:      number; // $ / 1M tokens
  cacheRead:  number;
  cacheWrite: number;
  output:     number;
  contextMax: number; // tokens
}

const PRICING: Record<string, ModelPricing> = {
  'claude-opus-4-6':   { input: 15.00, cacheRead: 1.50, cacheWrite: 18.75, output: 75.00, contextMax: 200_000 },
  'claude-sonnet-4-6': { input:  3.00, cacheRead: 0.30, cacheWrite:  3.75, output: 15.00, contextMax: 200_000 },
  'claude-haiku-4-5':  { input:  0.25, cacheRead: 0.03, cacheWrite:  0.30, output:  1.25, contextMax: 200_000 },
};

// Unknown model → fallback to Sonnet rates + stderr warning (visible via --debug).
```

Updates via PR to this file. Documented in `CONTRIBUTING.md`.

### 6.5 Budget

Total hot-path budget: **< 40 ms** on a warm filesystem.

| Step | Budget |
|------|--------|
| stdin JSON parse | < 2 ms |
| transcript tail-read + parse | < 10 ms |
| git (3 subprocesses, parallel) | < 20 ms |
| pricing calc | < 1 ms |
| events cache read | < 2 ms |
| scene render | < 5 ms |
| stdout write + state.json write | < 2 ms |

All I/O parallelized via `Promise.all` where dependencies allow.

## 7. Rotation engine

### 7.1 Tick derivation

```ts
// rotation/tick.ts
const FRAME_MS = 120;                             // 8.3 fps wall-clock pacing
export const tick = (now = Date.now()) => Math.floor(now / FRAME_MS);
```

Wall-clock tick means rapid consecutive renders show consecutive frames; a long idle gap is skipped (scene advances as if time kept flowing). Scenes never appear stuck.

### 7.2 Scene selection

```ts
// rotation/select.ts
export function selectScene(ctx: SelectContext): Scene {
  const forced = evaluateTriggers(ctx);                  // priority-ordered, first match wins
  if (forced) return forced;

  const pool = buildPool(ctx);                           // filters by --scenes, --exclude, --events availability
  const cycleSeconds = ctx.cycleSeconds ?? 20;
  const index = Math.floor(ctx.now / 1000 / cycleSeconds) % pool.length;
  return pool[index];
}
```

Pool building:
- Default pool = all 12 full-time scenes from §5.1 and §5.2.
- `--scenes=matrix-rain,decrypt,msf` → only those in the pool.
- `--exclude=wardial` → that scene removed.
- `--events=seckc` AND SecKC within 7 days → `seckc-upcoming` added to the pool.

Rotation is **deterministic across processes**: two terminals with Claude Code open render the same scene in sync at the same wall-clock second (modulo local trigger overrides).

### 7.3 Triggers

```ts
// rotation/triggers.ts — priority order, first match wins
const TRIGGERS: Trigger[] = [
  // context pressure escalation (most important)
  { id: 'ctx-critical', when: d => d.context.pct >= 98, force: 'kernel-panic',    durationSeconds: 60 },
  { id: 'ctx-overflow', when: d => d.context.pct >= 90, force: 'buffer-overflow', durationSeconds: 40 },
  { id: 'ctx-decrypt',  when: d => d.context.pct >= 75, force: 'decrypt',         durationSeconds: 30 },
  { id: 'ctx-crack',    when: d => d.context.pct >= 50, force: 'base64',          durationSeconds: 30 },

  // cost pressure
  { id: 'cost-pwned',   when: d => d.cost.totalUsd >= 10, force: 'ms08-067',      durationSeconds: 90 },
  { id: 'cost-warn',    when: d => d.cost.totalUsd >=  5, force: 'ms08-067',      durationSeconds: 30 },

  // state change (requires previous-render memory)
  { id: 'branch-swap',  when: d => branchChanged(d),      force: 'packet',        durationSeconds: 10 },
  { id: 'model-swap',   when: d => modelChanged(d),       force: 'matrix-rain',   durationSeconds: 10 },

  // event proximity (from event providers — only fires if --events enabled)
  { id: 'seckc-today',  when: d => daysUntilNext(d, 'seckc') === 0, force: 'seckc-today',    durationSeconds: 300 },
  { id: 'seckc-soon',   when: d => daysUntilNext(d, 'seckc') <= 1,  force: 'seckc-upcoming', durationSeconds: 120 },
];
```

**Pinning**: a matched trigger writes `{ triggerId, pinnedUntil }` to `state.json`. Subsequent invocations within the pin window replay the same forced scene, even if the triggering condition is no longer true. This guarantees the scene gets to play out fully instead of flickering on and off.

### 7.4 Persistent state

`~/.cache/hakcer-statusline/state.json`:

```json
{
  "lastBranch":     "feat/ink-port",
  "lastModel":      "claude-opus-4-6",
  "activeOverride": { "triggerId": "ctx-overflow", "pinnedUntil": 1776204123456 }
}
```

Read-modify-write per invocation, < 1 ms. Missing or corrupt → treat as empty, continue normally. No locking (statusline runs serially per Claude Code session).

## 8. Event providers

Generalized subsystem so SecKC is just the first of many. DEFCON, BSidesKC, local 2600 meetups, etc. drop in the same way.

### 8.1 Provider contract

```ts
// data/providers/types.ts
export interface UpcomingEvent {
  providerId: string;   // 'seckc'
  title:      string;   // 'SecKC - April 2026'
  startsAt:   number;   // unix ms
  endsAt:     number;
  location:   string;   // '701 N Montgall, KC MO'
  url:        string;   // https://seckc.org/upcoming-events/seckc-april-2026
  excerpt?:   string;
}

export interface EventProvider {
  id: string;           // kebab-case; also used in --events=<id>
  name: string;         // display: 'SecKC'
  ttlHours: number;     // cache freshness window
  fetchUpcoming(): Promise<UpcomingEvent[]>;
}
```

### 8.2 SecKC provider

Validated empirically 2026-04-08 — `https://www.seckc.org/upcoming-events?format=json-pretty` returns `d.upcoming[]` with `title`, `startDate` (unix ms), `endDate`, `location.addressLine1`, `location.addressLine2`, `fullUrl`, `excerpt`. Four events currently listed (April → July 2026). Implementation: plain `fetch`, map each item to `UpcomingEvent`, `ttlHours = 6`.

### 8.3 Cache + background refresh

`~/.cache/hakcer-statusline/events.json`. Rules:

1. **Read-only on the hot path.** Synchronous read at render time, missing → empty array → rotation proceeds with no event-triggered scenes.
2. **Background refresh after render.** After `process.stdout.write(line)`, if cache age > `ttlHours` for any enabled provider, spawn a detached child process that does the fetch and rewrites the cache. The current invocation finishes immediately; the next one sees fresh data.
3. **Stale is fine.** 6 h default TTL for SecKC. Events don't change minute-to-minute.
4. **Failures logged, not thrown.** Child process writes errors to `~/.cache/hakcer-statusline/events.log`. Network outages never break the statusline.

### 8.4 Privacy + opt-in

**Default: zero network calls.** Providers must be explicitly enabled:

- CLI flag: `--events=seckc,defcon`
- Env var: `HAKCER_STATUSLINE_EVENTS=seckc,defcon`
- `--events=off` disables even if cache exists; also deletes the cache file

On first enablement, a one-time stderr notice:

```
hakcer-statusline: enabling event providers [seckc]
  fetching in background — cache: ~/.cache/hakcer-statusline/events.json
  disable: --events=off
```

Fetch uses default User-Agent `hakcer-statusline/<version>`, no query parameters beyond the Squarespace `?format=json-pretty`, no user-identifying headers.

## 9. Render pipeline

### 9.1 Paint utilities

`render/paint.ts` — kleur-backed, truecolor-aware.

```ts
export function makePaint(theme: Theme): PaintFns {
  return {
    fg:       (s, colorKey) => kleur.rgb(...theme[colorKey])(s),
    gradient: (s, kind = 'head') => paintGradient(s, theme.gradientStops, kind),
    bold:     kleur.bold,
    dim:      kleur.dim,
    inverse:  kleur.inverse,
    glitch:   (s, intensity) => applyGlitchChars(s, intensity),
  };
}
```

`paintGradient` walks each visible character, interpolates between theme gradient stops, emits truecolor `\x1b[38;2;r;g;bm` codes. `applyGlitchChars` randomly (seeded by tick) replaces a fraction of chars with visual-noise glyphs. Both are ~20 lines each.

**Dependency**: add [`kleur`](https://github.com/lukeed/kleur) if not already a transitive dep of the Ink package. 1 KB, MIT, zero runtime deps.

### 9.2 Width detection

```ts
// render/width.ts
export function getWidth(): number {
  const envCols = parseInt(process.env['COLUMNS'] ?? '', 10);
  if (envCols > 0) return envCols;
  if (process.stdout.isTTY) return process.stdout.columns ?? 80;
  return 80;
}
```

Claude Code sets `COLUMNS` when piping to statusline commands. Fallback chain is tty → 80 cols.

### 9.3 Compose (safety net)

```ts
// render/compose.ts
export function composeScene(scene: Scene, ctx: SceneContext): string {
  let line = scene.render(ctx);
  if (stripAnsi(line).length > ctx.width) {
    line = truncateToVisibleWidth(line, ctx.width);
  }
  return line + ANSI_RESET;
}
```

A misbehaving contributor scene cannot break the user's terminal: width is clamped, ANSI state is always reset at end.

## 10. CLI surface

```
Usage:
  hakcer-statusline [options]                       # normal mode (Claude Code calls this)
  hakcer-statusline --preview [scene]               # dev: tight loop, clears + redraws
  hakcer-statusline --list                          # list all scene ids + verbs + themes
  hakcer-statusline --explain                       # dump stdin JSON payload (debug)
  hakcer-statusline --debug                         # normal mode + stderr timing/diagnostics

Flags:
  --theme <name>         Override canonical theme
                         (matrix|neon|synthwave|amber|ice|fire|cyber|mono|pastel|bloodred|kali)
  --scenes <csv>         Only use these scenes in rotation
  --exclude <csv>        Exclude these scenes from rotation
  --cycle-seconds <n>    Rotation cadence (default 20)
  --events <csv>         Enable event providers (default: none; 'off' to disable+purge)
  --no-git               Skip git subprocesses (saves ~15ms in non-git dirs)
  --scene <id>           Pin one scene, no rotation (for screenshots)
  --width <n>            Force width (default: detect from COLUMNS/tty/80)
  --version              Print version
  --help                 Print this text
```

### 10.1 Preview mode

Critical for development and contributor onboarding. Without it, debugging a scene means triggering Claude Code statusline refreshes one at a time.

```ts
// main.ts — --preview path runs until Ctrl-C
setInterval(() => {
  process.stdout.write('\x1b[2K\r');                      // clear line + carriage return
  process.stdout.write(composeScene(scene, ctx));
  ctx.tick++;
}, FRAME_MS);
```

Three preview sub-modes:
- `--preview` → cycles through all scenes, 5 s each
- `--preview <scene-id>` → single scene looped forever
- `--preview --all` → tall grid of all scenes side-by-side (terminal height permitting)

## 11. Testing strategy

Vitest (matches what the Ink package already uses).

### 11.1 Scene invariants suite

`__tests__/scenes.test.ts` runs a matrix test: every scene × ticks `{ 0, 50, 150, 300 }` × widths `{ 60, 80, 120, 200 }` × sample `SessionData` fixtures × all themes. For each combination it asserts:

1. `stripAnsi(output).length <= width`
2. No `\n` in output
3. ANSI sequences balanced (no unterminated escapes)
4. No `NaN`, `undefined`, `[object Object]` substrings
5. Render time < 5 ms (soft warning at 5 ms, hard fail at 20 ms)
6. Determinism: rendering the same args twice yields byte-identical output

Any contributor scene PR runs through this suite automatically.

### 11.2 Rotation suite

`__tests__/rotation.test.ts`:
- Trigger priority ordering (ctx-critical beats ctx-overflow beats cost-pwned, etc.)
- Pin duration respected across sequential calls
- `buildPool` filtering by `--scenes`, `--exclude`, `--events`
- Cycle determinism across fixed timestamps
- Branch/model change detection via `state.json` round-trip

### 11.3 Data suite

- `transcript.test.ts` — tail-reads fixture JSONL files of varying sizes, asserts correct usage extraction
- `pricing.test.ts` — cost math for every known model + Sonnet-fallback for unknowns
- `cache.test.ts` — TTL staleness, corrupt-cache recovery, concurrent-write safety

### 11.4 Provider suite

- `providers/seckc.test.ts` — parses committed `fixtures/seckc.json` → `UpcomingEvent[]`, verifies timestamp conversion, handles missing/empty fields, asserts schema mismatch errors are descriptive

### 11.5 Integration smoke test

One test that wires the full `main()` with mocked stdin, fixture transcript, no git, `--scene=matrix-rain`, asserts the output is a single styled line ≤ 120 chars.

## 12. Security & privacy

This is a CLI that runs on every Claude Code turn. Posture matters.

**Data handling:**
- **Transcript file**: read-only tail access. Never logged, never transmitted. Parsed for token counts only; no message content is extracted.
- **Stdin JSON**: contains `session_id`, paths, model info. Never logged unless `--explain` is explicitly passed.
- **Git output**: branch name, dirty flag. Never transmitted.
- **Pricing calc**: pure local math.

**Network posture:**
- Default: **zero network calls.**
- `--events=<provider>` enables opt-in background fetches. Fetches happen in detached child processes after render completes — never on the hot path.
- No telemetry. No error reporting service. Nothing phones home.

**Input validation:**
- Stdin JSON: `safeJsonParse` wrapper, treat parse failures as empty object
- Transcript lines: same pattern, skip malformed lines
- Provider responses: validated against `UpcomingEvent` schema before cache write; malformed payloads logged and discarded
- User flags: strict allowlist for `--theme`, `--scene`, `--events`; unknown values → exit 2 + help text

**File system:**
- Writes only to `~/.cache/hakcer-statusline/` (`state.json`, `events.json`, `events.log`)
- Cache dir created with 0700 perms
- Never writes to project directory

**Process model:**
- No shell = no injection. Git subprocesses via `execFile`, not `exec`.
- No `eval`, no `Function()`, no dynamic imports of user-controlled paths.
- Background fetch runs as detached child; stdout/stderr piped to the log file.

**Security review gate:** because this code touches the transcript file and can make network calls, the implementation PR **must** pass the `security-auditor` subagent before merge, per [CLAUDE.md](CLAUDE.md) §Security Rules.

## 13. Demo page + README showcase

Demos are the marketing and part of the product.

### 13.1 Recording: VHS

`.tape` files in `ink/statusline/demos/tapes/`, one per scene plus hero and triggers. Example:

```tape
# ink/statusline/demos/tapes/matrix-rain.tape
Output out/matrix-rain.gif
Set FontSize 14
Set Width 1200
Set Height 40
Set Theme "Catppuccin Mocha"
Hide
Type "hakcer-statusline --preview --scene=matrix-rain --width=100"
Enter
Show
Sleep 6s
Ctrl+C
```

Required tapes:
- `_hero-rotation.tape` — all 12 scenes, 2 s each (24 s hero loop)
- Per-scene tape for every scene in §5
- `trigger-ctx-overflow.tape` — shows buffer-overflow trigger firing at 90 % ctx
- `trigger-cost-pwned.tape` — shows ms08-067 firing at $5 cost
- `themes-compare.tape` — one reference scene rendered across all 9 themes

### 13.2 GIF hosting: orphan `demos` branch

Main branch stays lean. CI regenerates GIFs on every merge to main that touches `ink/source/statusline/**` or `ink/statusline/demos/tapes/**`, then force-pushes them to a `demos` orphan branch. README references them via `https://raw.githubusercontent.com/<user>/hakcer/demos/<scene>.gif`. Clones of main never download the GIFs unless the user opts in.

### 13.3 README structure

- Hero GIF at the top (rotation through all 12 scenes)
- Install snippet (npm + `settings.json`)
- Scenes table with per-scene GIF thumbnails
- Reactive triggers table with trigger-demo GIFs
- Themes section with the comparison grid
- Event providers section (opt-in) with SecKC scene GIF
- Contributing link to `CONTRIBUTING.md`

### 13.4 Standalone demo page

Lives at `ink/statusline/demos/docs/index.html`, served via GitHub Pages from that path. v1 implementation: plain HTML + CSS + static GIFs (same assets as README). Features: hero animation, pick-a-scene selector, install snippet with one-click copy, link to repo + contributing guide. Starting domain: `https://<user>.github.io/hakcer/`. No custom domain until traction warrants it.

**Out of scope for v1:** live JS browser recreation of scenes (separate codebase), 108-GIF theme × scene grid, asciinema player embeds.

### 13.5 CI workflow

New `.github/workflows/demos.yml`:

```yaml
name: Generate demo GIFs
on:
  push:
    branches: [main]
    paths:
      - 'ink/source/statusline/**'
      - 'ink/statusline/demos/tapes/**'
jobs:
  vhs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install && pnpm build
      - uses: charmbracelet/vhs-action@v2
        with:
          path: 'ink/statusline/demos/tapes'
      - run: ./ink/statusline/demos/scripts/publish.sh
```

`publish.sh` creates or checks out the `demos` orphan branch, copies GIFs in, commits with the main branch SHA as the message, force-pushes. No hand-maintained GIFs.

## 14. Risks + open questions

1. **Claude Code statusline JSON schema drift.** Field names change between Claude Code versions. **Mitigation:** defensive parsing with sensible fallbacks, `--explain` flag to help users debug, comments in `parse-stdin.ts` linking to the official Claude Code statusline docs.

2. **Cold-start time on slow filesystems.** Node startup + module load ~40–80 ms on an M1, could hit 150 ms on older hardware. **Mitigation:** not pre-optimizing. If users complain, migrate hot-path modules to a single bundled file via `esbuild` to shave ~30 ms off import resolution.

3. **Scene library balance.** 12 scenes × 20 s cycle = 4-minute full rotation. Most sessions hit every scene. **Mitigation:** tune post-launch based on feedback; add `--favorites` flag if needed.

4. **kleur dependency.** May not already be in the Ink package tree. **Mitigation:** add directly — 1 KB, MIT, no transitive deps. If even that is unwanted, we can hand-roll a ~30-line ANSI helper.

5. **Transcript path format assumption.** We assume Claude Code writes `{type: "assistant", message: {usage: {...}}}` in JSONL. **Mitigation:** ship a fixture transcript captured from the current Claude Code version; contract test fails loudly if the format changes.

6. **SecKC site / Squarespace JSON endpoint.** Undocumented; could be disabled or rate-limited. **Mitigation:** 6 h cache TTL means ≤4 fetches/day/user. Stale cache persists on fetch failure. If the endpoint dies, the trigger simply never fires and rotation continues normally.

7. **License compatibility.** hakcer is MIT (to verify in `package.json`). kleur is MIT. VHS is MIT. No GPL contamination.

8. **Unknown model pricing.** New Claude models will be released; pricing table lags. **Mitigation:** Sonnet-rate fallback + `--debug` stderr warning. Pricing updates are trivial PRs.

## 15. v1 scope summary

**In:**
- `hakcer-statusline` bin in the existing Ink package
- Full `ink/source/statusline/` tree per §3.1
- 12 scenes from §5 + 2 SecKC event scenes
- Event provider infrastructure + SecKC provider (opt-in)
- Rotation engine with all triggers from §7.3
- Preview mode, `--list`, `--explain`, `--debug`
- Full test suite per §11
- `CONTRIBUTING.md` sections for scenes and providers
- README showcase per §13.3
- Plain HTML demo page per §13.4
- CI workflow for VHS GIF regeneration per §13.5
- Pricing table for Opus 4.6 / Sonnet 4.6 / Haiku 4.5

**Out:**
- TOML / YAML config
- Starship passthrough
- Windows PowerShell support
- Multi-line statuslines
- User-local scenes outside the package
- Additional event providers beyond SecKC (welcomed as contributions post-merge)
- Live JS browser recreation of scenes on the demo page
- Custom domain
- Telemetry
- Rust rewrite

## 16. Success criteria

1. `hakcer-statusline` installs with `npm i -g hakcer` and works via one line in `settings.json`.
2. Cold-start render time < 150 ms on an M1 (target < 80 ms).
3. All 12 scenes pass the invariant suite across every width/tick/theme combination.
4. Adding a new scene is a single TypeScript file PR that passes CI without human review of the scene's rendering mechanics.
5. `--events=seckc` produces a background-cached `events.json` on first run and fires `seckc-upcoming` when an event is within 7 days.
6. Trigger system fires correctly for all seven rules in §7.3, verified by rotation test suite.
7. README renders GIFs from the `demos` branch on GitHub.
8. `security-auditor` subagent sign-off on the implementation PR.
9. Zero network calls unless `--events` is passed.
