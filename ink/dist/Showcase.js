import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Showcase — Interactive demo menu for haKCer Ink.
 * Port of the Python showcase.py using Ink components.
 */
import { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { Banner } from "./Banner.js";
import { THEMES, listThemes } from "./themes.js";
import { ALL_EFFECTS, FAST_EFFECTS, MEDIUM_EFFECTS, SLOW_EFFECTS, getRandomEffect } from "./effects/index.js";
const SYNTHWAVE_COMBOS = [
    ["synthwave", "decrypt"],
    ["cyberpunk", "matrix"],
    ["neon", "glitch"],
    ["tokyo_night", "waves"],
    ["dracula", "burn"],
];
export function Showcase() {
    const { exit } = useApp();
    const [screen, setScreen] = useState({ type: "menu" });
    const [menuTheme] = useState(() => {
        const themes = listThemes();
        return themes[Math.floor(Math.random() * themes.length)];
    });
    const themeColors = THEMES[menuTheme].colors;
    const primary = `#${themeColors.primary[0]}`;
    const secondary = `#${themeColors.primary[1]}`;
    const accent = `#${themeColors.accent[0]}`;
    useInput((input, key) => {
        if (screen.type === "menu") {
            switch (input) {
                case "1":
                    setScreen({ type: "showcase", index: 0 });
                    break;
                case "2":
                    setScreen({ type: "themes" });
                    break;
                case "3":
                    setScreen({
                        type: "banner",
                        effect: getRandomEffect("fast"),
                        theme: "synthwave",
                    });
                    break;
                case "4":
                    setScreen({ type: "effects" });
                    break;
                case "5":
                    setScreen({ type: "info" });
                    break;
                case "6":
                    setScreen({ type: "synthwave", index: 0 });
                    break;
                case "q":
                    exit();
                    break;
            }
        }
        else if (screen.type === "banner") {
            // Any key returns to menu (or next screen)
            setScreen(screen.next ?? { type: "menu" });
        }
        else if (screen.type === "themes") {
            // Number keys preview themes
            const themes = listThemes();
            const idx = parseInt(input) - 1;
            if (idx >= 0 && idx < themes.length) {
                setScreen({
                    type: "banner",
                    effect: getRandomEffect("fast"),
                    theme: themes[idx],
                    next: { type: "themes" },
                });
            }
            else if (key.escape || input === "q") {
                setScreen({ type: "menu" });
            }
        }
        else if (screen.type === "effects") {
            if (key.escape || input === "q") {
                setScreen({ type: "menu" });
            }
            // Number keys mapped to effect categories for quick preview
            if (input === "f") {
                setScreen({
                    type: "banner",
                    effect: getRandomEffect("fast"),
                    theme: menuTheme,
                    next: { type: "effects" },
                });
            }
            else if (input === "m") {
                setScreen({
                    type: "banner",
                    effect: getRandomEffect("medium"),
                    theme: menuTheme,
                    next: { type: "effects" },
                });
            }
            else if (input === "s") {
                setScreen({
                    type: "banner",
                    effect: getRandomEffect("slow"),
                    theme: menuTheme,
                    next: { type: "effects" },
                });
            }
        }
        else if (screen.type === "info") {
            if (key.escape || input === "q" || key.return) {
                setScreen({ type: "menu" });
            }
        }
        else if (screen.type === "showcase") {
            // Auto-advance handled by onComplete, but allow skip
            if (key.escape || input === "q") {
                setScreen({ type: "menu" });
            }
        }
        else if (screen.type === "synthwave") {
            if (key.escape || input === "q") {
                setScreen({ type: "menu" });
            }
        }
    });
    // ─── Menu ───
    if (screen.type === "menu") {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { bold: true, color: primary, children: "\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557" }), _jsx(Text, { bold: true, color: primary, children: "\u2551          haKCer Ink \u2014 Synthwave Demo & Showcase         \u2551" }), _jsx(Text, { bold: true, color: primary, children: "\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D" }), _jsx(Text, { children: " " }), _jsxs(Box, { flexDirection: "column", paddingLeft: 4, children: [_jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[1]" }), _jsx(Text, { color: secondary, children: " Showcase All" }), _jsx(Text, { dimColor: true, children: "    \u2014 Cycle through all effect + theme combos" })] }), _jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[2]" }), _jsx(Text, { color: secondary, children: " Theme Gallery" }), _jsx(Text, { dimColor: true, children: "   \u2014 Browse and preview themes" })] }), _jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[3]" }), _jsx(Text, { color: secondary, children: " Quick Demo" }), _jsx(Text, { dimColor: true, children: "      \u2014 Random fast effect" })] }), _jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[4]" }), _jsx(Text, { color: secondary, children: " Effect Browser" }), _jsx(Text, { dimColor: true, children: "  \u2014 Browse effects by speed" })] }), _jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[5]" }), _jsx(Text, { color: secondary, children: " Info" }), _jsx(Text, { dimColor: true, children: "            \u2014 List all themes & effects" })] }), _jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[6]" }), _jsx(Text, { color: secondary, children: " Synthwave Mode" }), _jsx(Text, { dimColor: true, children: " \u2014 Ultimate synthwave experience" })] }), _jsxs(Text, { children: [_jsx(Text, { color: accent, bold: true, children: "[q]" }), _jsx(Text, { color: secondary, children: " Exit" })] })] }), _jsx(Text, { children: " " }), _jsxs(Text, { dimColor: true, children: ["  Menu theme: ", menuTheme] })] }));
    }
    // ─── Banner view ───
    if (screen.type === "banner") {
        return (_jsxs(Box, { flexDirection: "column", children: [_jsx(Banner, { effect: screen.effect, theme: screen.theme, onComplete: () => {
                        // Stay rendered, user presses key to go back
                    } }), _jsx(Text, { children: " " }), _jsxs(Text, { dimColor: true, children: ["[", screen.theme, " \u00D7 ", screen.effect, "] Press any key to go back"] })] }));
    }
    // ─── Showcase ───
    if (screen.type === "showcase") {
        const themes = listThemes();
        const totalCombos = themes.length * ALL_EFFECTS.length;
        const idx = screen.index;
        if (idx >= totalCombos) {
            return (_jsxs(Box, { flexDirection: "column", paddingX: 2, children: [_jsx(Text, { bold: true, color: "green", children: "SHOWCASE COMPLETE!" }), _jsxs(Text, { children: ["Displayed ", totalCombos, " effect combinations."] }), _jsx(Text, { dimColor: true, children: "Press any key to return to menu" })] }));
        }
        const themeIdx = Math.floor(idx / ALL_EFFECTS.length);
        const effectIdx = idx % ALL_EFFECTS.length;
        const currentTheme = themes[themeIdx];
        const currentEffect = ALL_EFFECTS[effectIdx];
        return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { bold: true, color: accent, children: ["\u2501\u2501\u2501 ", idx + 1, "/", totalCombos, " \u2501\u2501\u2501"] }), _jsxs(Text, { children: [_jsx(Text, { color: "yellow", children: "Theme:" }), " ", currentTheme, "  ", _jsx(Text, { color: "cyan", children: "Effect:" }), " ", currentEffect] }), _jsx(Banner, { effect: currentEffect, theme: currentTheme, holdTime: 1.5, onComplete: () => {
                        setScreen({ type: "showcase", index: idx + 1 });
                    } })] }));
    }
    // ─── Theme Gallery ───
    if (screen.type === "themes") {
        const themes = listThemes();
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { bold: true, color: primary, children: "THEME GALLERY" }), _jsx(Text, { children: " " }), themes.map((name, i) => {
                    const t = THEMES[name];
                    return (_jsxs(Text, { children: [_jsxs(Text, { color: accent, bold: true, children: ["[", i + 1, "]"] }), _jsxs(Text, { color: `#${t.colors.primary[0]}`, children: [" ", name] }), _jsxs(Text, { dimColor: true, children: [" \u2014 ", t.description] })] }, name));
                }), _jsx(Text, { children: " " }), _jsx(Text, { dimColor: true, children: "Press number to preview, [q] to go back" })] }));
    }
    // ─── Effect Browser ───
    if (screen.type === "effects") {
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { bold: true, color: primary, children: "EFFECT BROWSER" }), _jsx(Text, { children: " " }), _jsxs(Text, { bold: true, color: "green", children: ["FAST (", FAST_EFFECTS.length, ")"] }), _jsxs(Text, { children: ["  ", FAST_EFFECTS.join(" | ")] }), _jsx(Text, { children: " " }), _jsxs(Text, { bold: true, color: "yellow", children: ["MEDIUM (", MEDIUM_EFFECTS.length, ")"] }), _jsxs(Text, { children: ["  ", MEDIUM_EFFECTS.join(" | ")] }), _jsx(Text, { children: " " }), _jsxs(Text, { bold: true, color: "red", children: ["SLOW (", SLOW_EFFECTS.length, ")"] }), _jsxs(Text, { children: ["  ", SLOW_EFFECTS.join(" | ")] }), _jsx(Text, { children: " " }), _jsx(Text, { dimColor: true, children: "[f] random fast  [m] random medium  [s] random slow  [q] back" })] }));
    }
    // ─── Info ───
    if (screen.type === "info") {
        const themes = listThemes();
        return (_jsxs(Box, { flexDirection: "column", paddingX: 2, paddingY: 1, children: [_jsx(Text, { bold: true, color: primary, children: "haKCer Ink \u2014 Info" }), _jsx(Text, { children: " " }), _jsxs(Text, { bold: true, children: ["Themes (", themes.length, "):"] }), _jsxs(Text, { children: ["  ", themes.join(", ")] }), _jsx(Text, { children: " " }), _jsxs(Text, { bold: true, children: ["Effects (", ALL_EFFECTS.length, "):"] }), _jsxs(Text, { children: ["  ", ALL_EFFECTS.sort().join(", ")] }), _jsx(Text, { children: " " }), _jsx(Text, { bold: true, children: "Speed categories:" }), _jsxs(Text, { children: ["  Fast: ", FAST_EFFECTS.length, "  Medium: ", MEDIUM_EFFECTS.length, "  Slow: ", SLOW_EFFECTS.length] }), _jsx(Text, { children: " " }), _jsx(Text, { dimColor: true, children: "Press any key to return" })] }));
    }
    // ─── Synthwave Mode ───
    if (screen.type === "synthwave") {
        const idx = screen.index;
        if (idx >= SYNTHWAVE_COMBOS.length) {
            return (_jsxs(Box, { flexDirection: "column", paddingX: 2, children: [_jsx(Text, { bold: true, color: "green", children: "SYNTHWAVE MODE COMPLETE!" }), _jsx(Text, { children: "Hope you enjoyed the ride!" }), _jsx(Text, { dimColor: true, children: "Press any key to return" })] }));
        }
        const [comboTheme, comboEffect] = SYNTHWAVE_COMBOS[idx];
        return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { bold: true, color: accent, children: ["\u2501\u2501\u2501 COMBO ", idx + 1, "/", SYNTHWAVE_COMBOS.length, " \u2501\u2501\u2501"] }), _jsxs(Text, { children: [_jsx(Text, { color: "magenta", children: comboTheme }), " \u00D7 ", _jsx(Text, { color: "cyan", children: comboEffect })] }), _jsx(Banner, { effect: comboEffect, theme: comboTheme, holdTime: 2, onComplete: () => {
                        setScreen({ type: "synthwave", index: idx + 1 });
                    } })] }));
    }
    return null;
}
export default Showcase;
//# sourceMappingURL=Showcase.js.map