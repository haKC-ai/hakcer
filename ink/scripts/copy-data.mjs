#!/usr/bin/env node
/**
 * Copy source/statusline/data/*.json → dist/statusline/data/*.json
 * tsc doesn't copy JSON. Runs after build.
 */
import { mkdirSync, copyFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = join(here, "..");
const src = join(pkgRoot, "source", "statusline", "data");
const dst = join(pkgRoot, "dist", "statusline", "data");

if (!existsSync(src)) {
  console.error(`copy-data: source missing: ${src}`);
  process.exit(1);
}

mkdirSync(dst, { recursive: true });

let copied = 0;
for (const entry of readdirSync(src, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".json")) {
    copyFileSync(join(src, entry.name), join(dst, entry.name));
    copied++;
  }
}

console.log(`copy-data: ${copied} JSON file(s) → dist/statusline/data/`);

// Also ensure cli.js is executable and has a shebang
import { readFileSync, writeFileSync, chmodSync } from "node:fs";
const cliPath = join(pkgRoot, "dist", "statusline", "cli.js");
if (existsSync(cliPath)) {
  let content = readFileSync(cliPath, "utf8");
  if (!content.startsWith("#!")) {
    content = "#!/usr/bin/env node\n" + content;
    writeFileSync(cliPath, content);
  }
  chmodSync(cliPath, 0o755);
}
