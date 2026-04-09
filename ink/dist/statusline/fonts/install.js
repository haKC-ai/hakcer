/**
 * --install-fonts: download + install JetBrains Mono Nerd Font.
 * macOS → Homebrew cask if available, else manual download.
 * Linux  → download to ~/.local/share/fonts and run fc-cache.
 * Windows → not supported in v1.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, createWriteStream } from "node:fs";
import { join } from "node:path";
import { homedir, platform } from "node:os";
import https from "node:https";
import { detectFontCaps } from "../render/font-detect.js";
const FONT_RELEASE = "https://github.com/ryanoasis/nerd-fonts/releases/download/v3.2.1/JetBrainsMono.zip";
export async function installFonts() {
    const caps = detectFontCaps();
    if (caps.nerdFont) {
        console.log(`✓ Nerd Font already detected (${caps.source}).`);
        console.log("  No action taken.");
        return 0;
    }
    const plat = platform();
    console.log("hakcer-statusline — font installer");
    console.log("");
    console.log("This will install JetBrains Mono Nerd Font.");
    console.log("  source: github.com/ryanoasis/nerd-fonts/releases (MIT license)");
    console.log("");
    if (plat === "darwin")
        return installMacOS();
    if (plat === "linux")
        return installLinux();
    console.error(`! Automatic install not supported on ${plat}.`);
    console.error("  Manually install JetBrains Mono Nerd Font from:");
    console.error("  https://www.nerdfonts.com/font-downloads");
    return 1;
}
function installMacOS() {
    // Prefer Homebrew
    const hasBrew = spawnSync("which", ["brew"], { encoding: "utf8" }).status === 0;
    if (hasBrew) {
        console.log("→ Using Homebrew...");
        const result = spawnSync("brew", ["install", "--cask", "font-jetbrains-mono-nerd-font"], { stdio: "inherit" });
        if (result.status === 0) {
            printSuccess();
            return 0;
        }
        console.error("! Homebrew install failed.");
        return 1;
    }
    console.error("! Homebrew not found.");
    console.error("  Install Homebrew (https://brew.sh) and re-run, or manually download:");
    console.error("  " + FONT_RELEASE);
    return 1;
}
async function installLinux() {
    const fontsDir = join(homedir(), ".local", "share", "fonts");
    mkdirSync(fontsDir, { recursive: true });
    const zipPath = join(fontsDir, "JetBrainsMono-NerdFont.zip");
    console.log(`→ Downloading to ${zipPath}...`);
    try {
        await downloadFile(FONT_RELEASE, zipPath);
    }
    catch (err) {
        console.error(`! Download failed: ${err.message}`);
        return 1;
    }
    console.log("→ Extracting...");
    const unzip = spawnSync("unzip", ["-o", zipPath, "-d", fontsDir], { stdio: "inherit" });
    if (unzip.status !== 0) {
        console.error("! unzip failed. Install 'unzip' and re-run.");
        return 1;
    }
    console.log("→ Refreshing font cache...");
    spawnSync("fc-cache", ["-f"], { stdio: "inherit" });
    printSuccess();
    return 0;
}
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(dest);
        https
            .get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                // follow redirect
                const loc = res.headers.location;
                if (!loc)
                    return reject(new Error("redirect without location"));
                file.close();
                downloadFile(loc, dest).then(resolve, reject);
                return;
            }
            if (res.statusCode !== 200) {
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            res.pipe(file);
            file.on("finish", () => file.close(() => resolve()));
        })
            .on("error", (err) => {
            reject(err);
        });
    });
}
function printSuccess() {
    console.log("");
    console.log("✓ Installed.");
    console.log("  Set your terminal font to 'JetBrainsMono Nerd Font' and reload.");
    console.log("  Then re-run Claude Code to see the full glyph set.");
}
//# sourceMappingURL=install.js.map