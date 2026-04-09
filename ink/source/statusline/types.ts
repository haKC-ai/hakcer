/**
 * Canonical types for the hakcer-statusline engine.
 * Scenes live in data/scenes.json — these types mirror that shape.
 */

// ──────────────────────────────────────────────────────────────────────────
// Scene library (scenes.json shape)
// ──────────────────────────────────────────────────────────────────────────

export type SceneType = "data" | "theater";

export interface Scene {
  id: string;
  name: string;
  pack: string;
  type: SceneType;
  verb: string;
  sep?: string;
  palette: string;
  icons?: string[];
  /** Single static frame. Use `frames` instead for flipbook animation. */
  frame: string;
  /** Optional flipbook — if present, each tick picks `frames[tick % frames.length]`. */
  frames?: string[];
  /** Ticks per frame for flipbook (default 4 = ~2 fps). */
  frameTicks?: number;
  data_map?: Record<string, string>;
  desc: string;
  effect?: string;
  durationFrames?: number;
  sound?: string;
}

export interface PaletteDef {
  bg?: string;
  fg: string;
  accent?: string;
  glow?: string;
  highlight?: string;
  frost?: string;
  top?: string;
  // TMNT + other pack extras
  leo?: string;
  raph?: string;
  donnie?: string;
  mikey?: string;
  [key: string]: string | undefined;
}

export interface PackDef {
  flag: string;
  desc: string;
  effect?: string;
}

export interface EffectDef {
  type?: string;
  speed?: string;
  desc?: string;
}

export interface SpecialModes {
  corruption?: {
    flag: string;
    frequency?: string;
    messages: string[];
  };
  konami_easter_egg?: {
    trigger: string;
    hidden_scene_id: string;
  };
  sound_mode?: {
    flag: string;
    scene_sounds?: Record<string, string>;
  };
  combo_frames?: Record<string, unknown>;
  screensaver?: {
    trigger: string;
    timeout_seconds: number;
    banner_source?: string;
    effects?: string[];
  };
  motd_rotation?: Record<string, unknown>;
}

export interface SceneLibrary {
  meta: {
    name: string;
    version: string;
    description: string;
    scene_count: number;
    pack_count: number;
  };
  glyph_registry: Record<string, Record<string, { hex?: string; fallback?: string }>>;
  font_logos?: Record<string, unknown>;
  palettes: Record<string, PaletteDef | string[]>;
  separator_map: Record<string, string>;
  effects: Record<string, EffectDef | Record<string, string> | string[]>;
  special_modes: SpecialModes;
  packs: Record<string, PackDef>;
  scenes: Scene[];
}

// ──────────────────────────────────────────────────────────────────────────
// Session data (raw + resolved)
// ──────────────────────────────────────────────────────────────────────────

export interface StdinPayload {
  session_id?: string;
  model?: { id?: string; display_name?: string };
  workspace?: { current_dir?: string; project_dir?: string };
  transcript_path?: string;
  cwd?: string;
  version?: string;
  output_style?: { name?: string };
}

export interface TokenUsage {
  input: number;
  output: number;
  cache_read: number;
  cache_write: number;
  total: number;
}

export interface GitInfo {
  branch: string;
  dirty: boolean;
  ahead: number;
  behind: number;
}

export interface CostInfo {
  totalUsd: number;
  input: number;
  output: number;
  cache_read: number;
  cache_write: number;
}

export interface ContextInfo {
  used: number;
  total: number;
  pct: number;
}

export interface SessionData {
  sessionId: string;
  model: string;
  modelId: string;
  tokens: TokenUsage;
  cost: CostInfo;
  context: ContextInfo;
  git: GitInfo | null;
  cwd: string;
  transcriptPath?: string;
  events: {
    seckc?: {
      next?: SecKCEvent;
    };
  };
}

export interface SecKCEvent {
  title: string;
  location: string;
  time_local: string;
  days_until: number;
  start_date: string;
  url?: string;
}

// ──────────────────────────────────────────────────────────────────────────
// Resolved data tree — what scene templates resolve placeholders against
// ──────────────────────────────────────────────────────────────────────────

export interface ResolvedData {
  model: string;
  model_id: string;
  cost: string;
  cost_raw: number;
  context: string;
  context_pct: number;
  context_used: number;
  context_total: number;
  ctx_bar: string;
  ctx: string;
  git: string;
  git_branch: string;
  git_dirty: boolean;

  // tick-dependent partials (decrypt scene et al)
  model_partial: string;
  cost_partial: string;
  ctx_partial: string;
  git_partial: string;

  tokens: {
    input: number;
    output: number;
    cache_read: number;
    cache_write: number;
    total: number;
  };

  events: {
    seckc?: {
      next?: {
        title: string;
        location: string;
        days_until: number;
        time_local: string;
      };
    };
  };

  [key: string]: unknown;
}

// ──────────────────────────────────────────────────────────────────────────
// Render context
// ──────────────────────────────────────────────────────────────────────────

export interface FontCaps {
  nerdFont: boolean;
  source: string;
}

export interface RenderContext {
  tick: number;
  width: number;
  resolvedData: ResolvedData;
  fontCaps: FontCaps;
  sessionData: SessionData;
  now: number;
}

// ──────────────────────────────────────────────────────────────────────────
// Rotation
// ──────────────────────────────────────────────────────────────────────────

export interface Trigger {
  id: string;
  when: (d: SessionData) => boolean;
  force: string;
  durationSeconds: number;
}

export interface PoolOpts {
  packs?: string[];
  scenes?: string[];
  exclude?: string[];
  events?: string[];
  data?: SessionData;
}

export interface SelectContext {
  now: number;
  cycleSeconds?: number;
  enabledPacks?: string[];
  sceneAllowlist?: string[];
  sceneExclusions?: string[];
  enabledProviders?: string[];
  data: SessionData;
  state: PersistentState;
}

// ──────────────────────────────────────────────────────────────────────────
// Persistent state
// ──────────────────────────────────────────────────────────────────────────

export interface PersistentState {
  lastBranch?: string;
  lastModel?: string;
  activeOverride?: {
    triggerId: string;
    force: string;
    pinnedUntil: number;
  } | null;
  lastRenderAt?: number;
  motdLastRotated?: number;
  konamiExpires?: number;
}

// ──────────────────────────────────────────────────────────────────────────
// CLI flags
// ──────────────────────────────────────────────────────────────────────────

export interface CliFlags {
  preview: boolean;
  list: boolean;
  listPacks: boolean;
  listPalettes: boolean;
  explain: boolean;
  debug: boolean;
  installFonts: boolean;
  konami: boolean;
  version: boolean;
  help: boolean;
  pack?: string[];
  scenes?: string[];
  exclude?: string[];
  palette?: string;
  events?: string[];
  cycleSeconds?: number;
  scene?: string;
  effect?: string;
  noGit: boolean;
  width?: number;
  corrupt: boolean;
  sound: boolean;
  combo: boolean;
  noScreensaver: boolean;
  screensaver?: boolean;
  konamiOff: boolean;
  _enable?: boolean;
  _disable?: boolean;
  _uninstall?: boolean;
}
