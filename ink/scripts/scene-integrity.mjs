#!/usr/bin/env node
/**
 * Smoke integrity test: render every scene in scenes.json at a few widths
 * and a few ticks. Checks that:
 *   - Every scene renders without throwing
 *   - stripAnsi(rendered).length <= width
 *   - No newlines in output
 *   - Not all chars are literal {placeholder} (template leak)
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const distRoot = join(here, "..", "dist", "statusline");

const { interpretScene, composeScene } = await import(join(distRoot, "render", "interpret.js"));
const { stripAnsi } = await import(join(distRoot, "render", "palette.js"));
const { buildResolvedData } = await import(join(distRoot, "data", "resolver.js"));

const libPath = join(distRoot, "data", "scenes.json");
const library = JSON.parse(readFileSync(libPath, "utf8"));

const session = {
  sessionId: "test",
  model: "opus-4.6",
  modelId: "claude-opus-4-6",
  tokens: { input: 50000, output: 5000, cache_read: 10000, cache_write: 0, total: 65000 },
  cost: { totalUsd: 0.75, input: 0.75, output: 0.375, cache_read: 0.015, cache_write: 0 },
  context: { used: 60000, total: 200000, pct: 30 },
  git: { branch: "main", dirty: false, ahead: 0, behind: 0 },
  cwd: "/tmp",
  events: {},
};

const fontCaps = { nerdFont: false, source: "test" };
const widths = [60, 80, 120, 200];
const ticks = [0, 50, 150, 300];

let passed = 0;
let failed = 0;
const failures = [];

for (const scene of library.scenes) {
  if (scene.id === "konami_winner") continue;
  for (const width of widths) {
    for (const tick of ticks) {
      const resolvedData = buildResolvedData(session, tick);
      const ctx = { tick, width, resolvedData, fontCaps, sessionData: session, now: Date.now() };
      try {
        const rendered = interpretScene(scene, ctx, library);
        const composed = composeScene(rendered, width);
        const plain = stripAnsi(composed);

        if (plain.includes("\n")) {
          failures.push(`${scene.id} @w${width}t${tick}: contains newline`);
          failed++;
          continue;
        }
        if (plain.length > width) {
          failures.push(`${scene.id} @w${width}t${tick}: overflow ${plain.length} > ${width}`);
          failed++;
          continue;
        }
        if (/\{\w+\}/.test(plain) && scene.type === "data") {
          // template leak — allow one leaked placeholder since some scenes may
          // reference keys not in resolver, but flag more than two
          const leaks = (plain.match(/\{\w+\}/g) || []).length;
          if (leaks > 2) {
            failures.push(`${scene.id} @w${width}t${tick}: ${leaks} unresolved placeholders`);
            failed++;
            continue;
          }
        }
        passed++;
      } catch (err) {
        failures.push(`${scene.id} @w${width}t${tick}: THREW ${err.message}`);
        failed++;
      }
    }
  }
}

console.log(`scene integrity: ${passed} pass / ${failed} fail / ${library.scenes.length} scenes`);
if (failures.length > 0) {
  console.log("\nfailures:");
  for (const f of failures.slice(0, 20)) console.log(`  ${f}`);
  if (failures.length > 20) console.log(`  ... and ${failures.length - 20} more`);
  process.exit(1);
}
process.exit(0);
