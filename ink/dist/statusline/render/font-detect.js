export function detectFontCaps(env = process.env) {
    const override = env.HAKCER_STATUSLINE_NERD_FONT;
    if (override === "1")
        return { nerdFont: true, source: "env-override:on" };
    if (override === "0")
        return { nerdFont: false, source: "env-override:off" };
    const termProgram = env.TERM_PROGRAM ?? "";
    // Known-good terminals
    if (/iTerm\.app|Alacritty|kitty|WezTerm|Ghostty|Warp|Hyper/.test(termProgram)) {
        return { nerdFont: true, source: `term-program:${termProgram}` };
    }
    if (env.LC_TERMINAL === "iTerm2") {
        return { nerdFont: true, source: "lc-terminal:iTerm2" };
    }
    // VS Code usually ships without a Nerd Font unless the user set one.
    // The fallback path is still legible there.
    if (termProgram === "vscode") {
        return { nerdFont: false, source: "term-program:vscode" };
    }
    // Apple Terminal.app doesn't have Nerd Font by default.
    if (termProgram === "Apple_Terminal") {
        return { nerdFont: false, source: "term-program:Apple_Terminal" };
    }
    // Default: assume Nerd Font is present. If it isn't, the user sees tofu
    // and sets HAKCER_STATUSLINE_NERD_FONT=0. That's a better default than
    // silently degrading to ASCII for everyone.
    return { nerdFont: true, source: "default-on" };
}
//# sourceMappingURL=font-detect.js.map