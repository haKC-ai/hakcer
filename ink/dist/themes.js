/**
 * Theme configurations for haKCer banner effects.
 * Each theme defines color palettes applied to terminal effects.
 */
export const THEMES = {
    synthwave: {
        name: "Synthwave",
        description: "Classic synthwave with cyan, magenta, purple (default)",
        colors: {
            primary: ["00D9FF", "FF10F0", "7928CA"],
            accent: ["FF0080", "00F0FF"],
            error: ["FF006E"],
            gradient_stops: ["00D9FF", "FF10F0", "7928CA"],
            beam_colors: ["00D9FF", "FF0080"],
        },
    },
    tokyo_night: {
        name: "Tokyo Night",
        description: "Dark blue aesthetic with purple and teal accents",
        colors: {
            primary: ["7aa2f7", "bb9af7", "7dcfff"],
            accent: ["f7768e", "9ece6a"],
            error: ["f7768e"],
            gradient_stops: ["7aa2f7", "bb9af7", "2ac3de"],
            beam_colors: ["7dcfff", "bb9af7"],
        },
    },
    tokyo_night_storm: {
        name: "Tokyo Night Storm",
        description: "Deeper blue Tokyo Night variant with stronger contrast",
        colors: {
            primary: ["82aaff", "c792ea", "89ddff"],
            accent: ["ff757f", "c3e88d"],
            error: ["ff5370"],
            gradient_stops: ["82aaff", "c792ea", "89ddff"],
            beam_colors: ["89ddff", "c792ea"],
        },
    },
    neon: {
        name: "Neon",
        description: "Bright electric neon colors - pink, green, blue",
        colors: {
            primary: ["00ff00", "ff00ff", "00ffff"],
            accent: ["ffff00", "ff0080"],
            error: ["ff0000"],
            gradient_stops: ["00ff00", "ff00ff", "00ffff"],
            beam_colors: ["00ffff", "ff00ff"],
        },
    },
    cyberpunk: {
        name: "Cyberpunk",
        description: "Yellow and pink cyberpunk 2077 inspired colors",
        colors: {
            primary: ["fcee09", "ff2a6d", "05d9e8"],
            accent: ["d1f7ff", "ff6c11"],
            error: ["ff013c"],
            gradient_stops: ["fcee09", "ff2a6d", "05d9e8"],
            beam_colors: ["fcee09", "ff2a6d"],
        },
    },
    matrix: {
        name: "Matrix",
        description: "Classic green matrix theme",
        colors: {
            primary: ["00ff41", "008f11", "003b00"],
            accent: ["00ff41", "00d936"],
            error: ["00ff41"],
            gradient_stops: ["00ff41", "008f11", "003b00"],
            beam_colors: ["00ff41", "008f11"],
        },
    },
    dracula: {
        name: "Dracula",
        description: "Popular Dracula theme - purple, pink, cyan",
        colors: {
            primary: ["bd93f9", "ff79c6", "8be9fd"],
            accent: ["50fa7b", "ffb86c"],
            error: ["ff5555"],
            gradient_stops: ["bd93f9", "ff79c6", "8be9fd"],
            beam_colors: ["8be9fd", "ff79c6"],
        },
    },
    nord: {
        name: "Nord",
        description: "Arctic, north-bluish color palette",
        colors: {
            primary: ["88c0d0", "81a1c1", "5e81ac"],
            accent: ["b48ead", "a3be8c"],
            error: ["bf616a"],
            gradient_stops: ["88c0d0", "81a1c1", "b48ead"],
            beam_colors: ["88c0d0", "5e81ac"],
        },
    },
    gruvbox: {
        name: "Gruvbox",
        description: "Retro groove warm colors",
        colors: {
            primary: ["fe8019", "d3869b", "83a598"],
            accent: ["b8bb26", "fabd2f"],
            error: ["fb4934"],
            gradient_stops: ["fe8019", "d3869b", "83a598"],
            beam_colors: ["fabd2f", "fe8019"],
        },
    },
};
let currentTheme = "neon";
export function getTheme(name) {
    const themeName = name ?? currentTheme;
    const theme = THEMES[themeName];
    if (!theme) {
        const available = Object.keys(THEMES).sort().join(", ");
        throw new Error(`Unknown theme: ${themeName}. Available: ${available}`);
    }
    return theme;
}
export function setTheme(name) {
    if (!THEMES[name]) {
        const available = Object.keys(THEMES).sort().join(", ");
        throw new Error(`Unknown theme: ${name}. Available: ${available}`);
    }
    currentTheme = name;
}
export function getCurrentTheme() {
    return currentTheme;
}
export function listThemes() {
    return Object.keys(THEMES).sort();
}
//# sourceMappingURL=themes.js.map