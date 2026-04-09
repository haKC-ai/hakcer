/**
 * Detect Nerd Font capability from env.
 * Not perfect — env heuristic. Override with HAKCER_STATUSLINE_NERD_FONT=0|1.
 */
import { FontCaps } from "../types.js";

export function detectFontCaps(env = process.env): FontCaps {
  const override = env.HAKCER_STATUSLINE_NERD_FONT;
  if (override === "1") return { nerdFont: true, source: "env-override" };
  if (override === "0") return { nerdFont: false, source: "env-override" };

  const termProgram = env.TERM_PROGRAM ?? "";
  if (/iTerm\.app|Alacritty|kitty|WezTerm|Ghostty/.test(termProgram)) {
    return { nerdFont: true, source: `term-program:${termProgram}` };
  }

  if (env.LC_TERMINAL === "iTerm2") {
    return { nerdFont: true, source: "lc-terminal:iTerm2" };
  }

  // VS Code integrated terminal usually doesn't have nerd font by default
  if (termProgram === "vscode") {
    return { nerdFont: false, source: "term-program:vscode" };
  }

  return { nerdFont: false, source: "unknown" };
}
