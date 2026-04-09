const SEP_GLYPHS = {
    arrow: { nerd: "\ue0b0", fallback: ">" },
    arrow_thin: { nerd: "\ue0b1", fallback: ">" },
    arrow_left: { nerd: "\ue0b2", fallback: "<" },
    round: { nerd: "\ue0b4", fallback: ")" },
    rounded: { nerd: "\ue0b4", fallback: ")" },
    round_left: { nerd: "\ue0b6", fallback: "(" },
    diagonal: { nerd: "\ue0bc", fallback: "/" },
    diag: { nerd: "\ue0bc", fallback: "/" },
    pixel: { nerd: "█", fallback: "█" },
    hexagon: { nerd: "\ue0b6", fallback: "⬢" },
    flame: { nerd: "\ue0c0", fallback: "~" },
    lego: { nerd: "⬛", fallback: "■" },
    dot: { nerd: "·", fallback: "·" },
    pipe: { nerd: "│", fallback: "|" },
};
export function resolveSeparator(scene, library, caps) {
    const sepId = scene.sep ?? library.separator_map[scene.pack] ?? "arrow";
    const glyph = SEP_GLYPHS[sepId] ?? SEP_GLYPHS.arrow;
    return caps.nerdFont ? glyph.nerd : glyph.fallback;
}
export function getSeparatorGlyph(id, caps) {
    const glyph = SEP_GLYPHS[id] ?? SEP_GLYPHS.arrow;
    return caps.nerdFont ? glyph.nerd : glyph.fallback;
}
//# sourceMappingURL=separator.js.map