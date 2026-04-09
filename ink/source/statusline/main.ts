/**
 * Main orchestrator — reads stdin, loads the library, resolves data,
 * picks a scene, renders it, writes to stdout, saves state, exits.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  CliFlags,
  SceneLibrary,
  SessionData,
  RenderContext,
  Scene,
} from "./types.js";
import { readStdin } from "./data/parse-stdin.js";
import { readTranscriptUsage } from "./data/transcript.js";
import { readGit } from "./data/git.js";
import { calcCost, calcContext, displayModel } from "./data/pricing.js";
import { buildResolvedData } from "./data/resolver.js";
import { getNextSecKCEvent, cacheIsStale, refreshInBackground } from "./data/providers/seckc.js";
import { readState, writeState } from "./cache/state.js";
import { currentTick } from "./rotation/tick.js";
import { selectScene } from "./rotation/select.js";
import { interpretScene, composeScene } from "./render/interpret.js";
import { detectFontCaps } from "./render/font-detect.js";
import { detectWidth } from "./render/width.js";
import { stripAnsi } from "./render/palette.js";
import { maybeCorrupt } from "./modes/corruption.js";
import { konamiActive } from "./modes/konami.js";
import { checkScreensaver } from "./modes/screensaver.js";

let cachedLibrary: SceneLibrary | null = null;

export function loadLibrary(): SceneLibrary {
  if (cachedLibrary) return cachedLibrary;
  const here = dirname(fileURLToPath(import.meta.url));
  // dist/statusline/main.js → ../statusline/data/scenes.json (when built)
  // source/statusline/main.ts → ../statusline/data/scenes.json (dev)
  const candidates = [
    join(here, "data", "scenes.json"),
    join(here, "..", "statusline", "data", "scenes.json"),
    join(here, "..", "..", "source", "statusline", "data", "scenes.json"),
  ];
  for (const path of candidates) {
    try {
      const raw = readFileSync(path, "utf8");
      cachedLibrary = JSON.parse(raw) as SceneLibrary;
      return cachedLibrary;
    } catch {
      continue;
    }
  }
  throw new Error("scenes.json not found");
}

export async function main(flags: CliFlags): Promise<void> {
  const startAt = Date.now();
  const library = loadLibrary();

  // List commands
  if (flags.list) return doList(library, flags);
  if (flags.listPacks) return doListPacks(library);
  if (flags.listPalettes) return doListPalettes(library);

  // Preview loop — render repeatedly with wall-clock tick advancing
  if (flags.preview) return runPreview(library, flags);

  // Read stdin payload (non-blocking with 50ms timeout)
  const stdin = await readStdin();

  if (flags.explain) {
    console.log(JSON.stringify(stdin, null, 2));
    return;
  }

  const cwd = stdin.workspace?.current_dir ?? stdin.cwd ?? process.cwd();
  const modelId = stdin.model?.id ?? "claude-sonnet-4-6";

  // Parallel: transcript + git
  const tokens = readTranscriptUsage(stdin.transcript_path);
  const gitPromise = flags.noGit ? Promise.resolve(null) : readGit(cwd);

  // Kick off background event refresh if stale and provider is enabled
  if (flags.events?.includes("seckc") && cacheIsStale()) {
    refreshInBackground();
  }

  const git = await gitPromise;

  const cost = calcCost(modelId, tokens);
  const context = calcContext(modelId, tokens);

  const sessionData: SessionData = {
    sessionId: stdin.session_id ?? "",
    model: displayModel(modelId),
    modelId,
    tokens,
    cost,
    context,
    git,
    cwd,
    transcriptPath: stdin.transcript_path,
    events: {
      seckc: flags.events?.includes("seckc")
        ? { next: getNextSecKCEvent() ?? undefined }
        : undefined,
    },
  };

  const state = readState();
  const now = Date.now();
  const tick = currentTick(now);
  const width = flags.width ?? detectWidth();
  const fontCaps = detectFontCaps();

  // Screensaver override
  if (!flags.noScreensaver) {
    const sv = checkScreensaver(state, now, width, tick);
    if (sv.active && sv.line) {
      process.stdout.write(sv.line);
      writeState({ ...state, lastRenderAt: now });
      return;
    }
  }

  // Resolved data tree for placeholder substitution
  const resolvedData = buildResolvedData(sessionData, tick);

  // Scene selection — --scene pin overrides everything
  let scene: Scene;
  let pinnedTrigger: { triggerId: string; force: string; pinnedUntil: number } | undefined;
  if (flags.scene) {
    const pinned = library.scenes.find((s) => s.id === flags.scene);
    scene = pinned ?? library.scenes[0]!;
  } else {
    const result = selectScene(
      {
        now,
        cycleSeconds: flags.cycleSeconds,
        enabledPacks: flags.pack,
        sceneAllowlist: flags.scenes,
        sceneExclusions: flags.exclude,
        enabledProviders: flags.events,
        data: sessionData,
        state,
      },
      library
    );
    scene = result.scene;
    pinnedTrigger = result.trigger;
  }

  // Apply --effect override by temporarily modifying the scene
  if (flags.effect) {
    scene = { ...scene, effect: flags.effect };
  }
  if (flags.palette) {
    scene = { ...scene, palette: flags.palette };
  }

  // Render
  const renderCtx: RenderContext = {
    tick,
    width,
    resolvedData,
    fontCaps,
    sessionData,
    now,
  };

  let rendered = interpretScene(scene, renderCtx, library);
  rendered = composeScene(rendered, width);

  // Konami override — pin konami_winner if the marker file is active
  if (!flags.konamiOff && konamiActive(now)) {
    const konami = library.scenes.find((s) => s.id === "konami_winner");
    if (konami) {
      const konamiRender = interpretScene(
        { ...konami, effect: "rainbow" },
        renderCtx,
        library
      );
      rendered = composeScene(konamiRender, width);
    }
  }

  // Corruption override (after konami so konami wins)
  if (flags.corrupt) {
    rendered = maybeCorrupt(rendered, tick, width);
  }

  process.stdout.write(rendered);

  // Persist state
  writeState({
    ...state,
    lastBranch: git?.branch ?? state.lastBranch,
    lastModel: modelId,
    lastRenderAt: now,
    activeOverride: pinnedTrigger ?? state.activeOverride ?? null,
  });

  if (flags.debug) {
    const elapsed = Date.now() - startAt;
    process.stderr.write(
      `\n[debug] scene=${scene.id} effect=${scene.effect ?? "default"} tick=${tick} width=${width} elapsed=${elapsed}ms font=${fontCaps.source}\n`
    );
  }
}

function doList(library: SceneLibrary, flags: CliFlags): void {
  const packs = flags.pack && flags.pack.length > 0 ? new Set(flags.pack) : null;
  for (const scene of library.scenes) {
    if (packs && !packs.has(scene.pack)) continue;
    const tag = scene.type === "data" ? "D" : "T";
    console.log(`${tag} ${scene.pack.padEnd(10)} ${scene.id.padEnd(32)} ${scene.verb.padEnd(12)} — ${scene.name}`);
  }
  console.log(`\n${library.scenes.length} scenes across ${Object.keys(library.packs).length} packs.`);
}

function doListPacks(library: SceneLibrary): void {
  const counts: Record<string, number> = {};
  for (const s of library.scenes) counts[s.pack] = (counts[s.pack] ?? 0) + 1;
  for (const [id, pack] of Object.entries(library.packs)) {
    const count = counts[id] ?? 0;
    console.log(`  ${id.padEnd(12)} ${String(count).padStart(3)}  ${pack.desc}`);
  }
}

async function runPreview(library: SceneLibrary, flags: CliFlags): Promise<void> {
  const width = flags.width ?? detectWidth();
  const fontCaps = detectFontCaps();

  // Fake session data for preview — synthesize a believable turn.
  const sessionData: SessionData = {
    sessionId: "preview",
    model: "opus-4.6",
    modelId: "claude-opus-4-6",
    tokens: { input: 76000, output: 8000, cache_read: 12000, cache_write: 2000, total: 98000 },
    cost: { totalUsd: 1.23, input: 1.14, output: 0.6, cache_read: 0.018, cache_write: 0.0375 },
    context: { used: 90000, total: 200000, pct: 45 },
    git: { branch: "feat/ink-port", dirty: true, ahead: 3, behind: 0 },
    cwd: process.cwd(),
    events: {},
  };

  // Handle Ctrl+C cleanly
  let running = true;
  process.on("SIGINT", () => {
    running = false;
    process.stdout.write("\n");
    process.exit(0);
  });

  // Select the scene list — explicit --scene pins, otherwise cycle all.
  const sceneList: Scene[] = flags.scene
    ? [library.scenes.find((s) => s.id === flags.scene) ?? library.scenes[0]!]
    : flags.pack
      ? library.scenes.filter((s) => flags.pack!.includes(s.pack))
      : library.scenes.filter((s) => !s.id.startsWith("konami_") && !["core_kernel_panic"].includes(s.id));

  const cycleSeconds = flags.cycleSeconds ?? 4;

  process.stdout.write("\x1b[?25l"); // hide cursor
  const cleanup = () => {
    process.stdout.write("\x1b[?25h\n"); // show cursor
  };
  process.on("exit", cleanup);

  let lastSceneIdx = -1;
  while (running) {
    const now = Date.now();
    const tick = currentTick(now);
    const sceneIdx = Math.floor(now / 1000 / cycleSeconds) % sceneList.length;
    const scene = sceneList[sceneIdx]!;

    if (sceneIdx !== lastSceneIdx) {
      // scene changed — print header
      process.stdout.write("\r\x1b[K");
      process.stdout.write(`\x1b[90m[${scene.pack}/${scene.id}] ${scene.verb} · ${scene.name}\x1b[0m\n`);
      lastSceneIdx = sceneIdx;
    }

    const resolvedData = buildResolvedData(sessionData, tick);
    const renderCtx: RenderContext = {
      tick,
      width,
      resolvedData,
      fontCaps,
      sessionData,
      now,
    };

    const effective = flags.effect ? { ...scene, effect: flags.effect } : scene;
    const rendered = composeScene(interpretScene(effective, renderCtx, library), width);
    process.stdout.write("\r\x1b[K" + rendered);

    await sleep(120);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function doListPalettes(library: SceneLibrary): void {
  for (const [id, p] of Object.entries(library.palettes)) {
    if (id.startsWith("_")) continue;
    if (Array.isArray(p)) {
      console.log(`  ${id}  (array)`);
      continue;
    }
    const def = p as { fg?: string; accent?: string };
    console.log(`  ${id.padEnd(20)} fg=${def.fg ?? "—"}  accent=${def.accent ?? "—"}`);
  }
}
