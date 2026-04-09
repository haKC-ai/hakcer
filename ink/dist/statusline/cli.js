#!/usr/bin/env node
/**
 * hakcer-statusline CLI entry.
 * Parses flags, hands off to main() for normal render or to subcommands.
 */
import { main } from "./main.js";
import { installFonts } from "./fonts/install.js";
import { triggerKonami } from "./modes/konami.js";
import { enableStatusline, disableStatusline, uninstallStatusline } from "./setup.js";
function parseFlags(argv) {
    const flags = {
        preview: false,
        list: false,
        listPacks: false,
        listPalettes: false,
        explain: false,
        debug: false,
        installFonts: false,
        konami: false,
        version: false,
        help: false,
        noGit: false,
        corrupt: false,
        sound: false,
        combo: false,
        noScreensaver: false,
        konamiOff: false,
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        const next = () => argv[++i];
        if (a === "--preview")
            flags.preview = true;
        else if (a === "--list")
            flags.list = true;
        else if (a === "--list-packs")
            flags.listPacks = true;
        else if (a === "--list-palettes")
            flags.listPalettes = true;
        else if (a === "--explain")
            flags.explain = true;
        else if (a === "--debug")
            flags.debug = true;
        else if (a === "--install-fonts")
            flags.installFonts = true;
        else if (a === "--konami")
            flags.konami = true;
        else if (a === "--version" || a === "-v")
            flags.version = true;
        else if (a === "--help" || a === "-h")
            flags.help = true;
        else if (a === "--no-git")
            flags.noGit = true;
        else if (a === "--corrupt")
            flags.corrupt = true;
        else if (a === "--sound")
            flags.sound = true;
        else if (a === "--combo")
            flags.combo = true;
        else if (a === "--no-screensaver")
            flags.noScreensaver = true;
        else if (a === "--screensaver")
            flags.screensaver = true;
        else if (a === "--konami-off")
            flags.konamiOff = true;
        else if (a === "--enable")
            flags._enable = true;
        else if (a === "--disable")
            flags._disable = true;
        else if (a === "--uninstall")
            flags._uninstall = true;
        else if (a.startsWith("--pack="))
            flags.pack = a.slice(7).split(",");
        else if (a === "--pack")
            flags.pack = (next() ?? "").split(",");
        else if (a.startsWith("--scenes="))
            flags.scenes = a.slice(9).split(",");
        else if (a === "--scenes")
            flags.scenes = (next() ?? "").split(",");
        else if (a.startsWith("--exclude="))
            flags.exclude = a.slice(10).split(",");
        else if (a === "--exclude")
            flags.exclude = (next() ?? "").split(",");
        else if (a.startsWith("--palette="))
            flags.palette = a.slice(10);
        else if (a === "--palette")
            flags.palette = next();
        else if (a.startsWith("--events="))
            flags.events = a.slice(9).split(",");
        else if (a === "--events")
            flags.events = (next() ?? "").split(",");
        else if (a.startsWith("--cycle-seconds="))
            flags.cycleSeconds = parseInt(a.slice(16), 10);
        else if (a === "--cycle-seconds")
            flags.cycleSeconds = parseInt(next() ?? "20", 10);
        else if (a.startsWith("--scene="))
            flags.scene = a.slice(8);
        else if (a === "--scene")
            flags.scene = next();
        else if (a.startsWith("--effect="))
            flags.effect = a.slice(9);
        else if (a === "--effect")
            flags.effect = next();
        else if (a.startsWith("--width="))
            flags.width = parseInt(a.slice(8), 10);
        else if (a === "--width")
            flags.width = parseInt(next() ?? "80", 10);
    }
    return flags;
}
function printHelp() {
    console.log(`hakcer-statusline — animated Claude Code statusline

Install:
  npm install -g github:haKC-ai/hakcer     # auto-configures Claude Code
  hakcer-statusline --enable                # manual enable (if postinstall skipped)
  hakcer-statusline --disable               # restore previous statusline
  hakcer-statusline --uninstall             # disable + print npm uninstall command

Usage:
  hakcer-statusline                     # normal mode (Claude Code calls this)
  hakcer-statusline --preview [scene]   # dev: tight loop
  hakcer-statusline --list              # list all scenes
  hakcer-statusline --list-packs        # list all 19 packs
  hakcer-statusline --list-palettes     # list all palettes
  hakcer-statusline --install-fonts     # install JetBrains Mono Nerd Font
  hakcer-statusline --konami            # trigger the konami easter egg

Filter flags:
  --pack <csv>          Enable only these packs (default: all)
  --scenes <csv>        Only these scene ids
  --exclude <csv>       Exclude these scene ids
  --palette <id>        Override palette
  --events <csv>        Enable event providers (e.g., seckc)
  --cycle-seconds <n>   Rotation cadence (default 20)

Behavior:
  --scene <id>          Pin one scene, no rotation
  --effect <id>         Override the scene's effect
  --no-git              Skip git subprocesses
  --width <n>           Force width
  --corrupt             Enable corruption mode (1-in-50 glitch flash)
  --sound               Enable sound mode
  --combo               Enable combo frame blending
  --no-screensaver      Disable idle screensaver
  --screensaver         Enable idle screensaver (off by default)
  --konami-off          Disable konami easter egg

Environment:
  HAKCER_STATUSLINE_NERD_FONT=0   Force disable Nerd Font glyphs
  HAKCER_STATUSLINE_NERD_FONT=1   Force enable Nerd Font glyphs
  HAKCER_STATUSLINE_SCREENSAVER=1 Enable idle screensaver
`);
}
async function run() {
    const flags = parseFlags(process.argv.slice(2));
    if (flags.help) {
        printHelp();
        process.exit(0);
    }
    if (flags.version) {
        // Lazy read package.json version
        try {
            const { readFileSync } = await import("node:fs");
            const { fileURLToPath } = await import("node:url");
            const { dirname, join } = await import("node:path");
            const here = dirname(fileURLToPath(import.meta.url));
            const pkg = JSON.parse(readFileSync(join(here, "..", "..", "package.json"), "utf8"));
            console.log(pkg.version ?? "0.0.0");
        }
        catch {
            console.log("unknown");
        }
        process.exit(0);
    }
    if (flags.installFonts) {
        const code = await installFonts();
        process.exit(code);
    }
    if (flags.konami) {
        triggerKonami();
        console.log("✓ konami armed — re-run Claude Code within 60s.");
        process.exit(0);
    }
    // Setup commands — enable/disable/uninstall
    if (flags._enable) {
        enableStatusline();
        process.exit(0);
    }
    if (flags._disable) {
        disableStatusline();
        process.exit(0);
    }
    if (flags._uninstall) {
        uninstallStatusline();
        process.exit(0);
    }
    await main(flags);
}
run().catch((err) => {
    process.stderr.write(`hakcer-statusline error: ${err.message}\n`);
    process.exit(0); // never fail the statusline
});
//# sourceMappingURL=cli.js.map