/**
 * Glitch effect — VHS-style glitch distortion that settles into the final text.
 */
import { colorize, gradient } from "../colors.js";
const GLITCH_CHARS = "█▓▒░╫╪╬╚╝╗╔║═┼┤├┬┴";
function glitchChar(seed) {
    return GLITCH_CHARS[seed % GLITCH_CHARS.length];
}
export const glitch = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const totalTicks = 30;
    const stability = Math.min(1, tick / totalTicks);
    const done = tick >= totalTicks;
    const grad = gradient(colors.gradient_stops, cols);
    const lines = [];
    for (let r = 0; r < rows; r++) {
        let line = "";
        const row = grid[r] ?? [];
        // Row-level glitch: horizontal offset
        const rowGlitch = stability < 0.8
            ? Math.floor(Math.sin(r * tick * 0.3) * (1 - stability) * 8)
            : 0;
        // Some rows get "corrupted" lines
        const isCorruptedRow = stability < 0.6 && ((r * 7 + tick * 13) % 20 < (1 - stability) * 15);
        for (let c = 0; c < cols; c++) {
            const srcCol = c - rowGlitch;
            const ch = (srcCol >= 0 && srcCol < cols) ? (row[srcCol] ?? " ") : " ";
            if (ch === " " && !isCorruptedRow) {
                line += " ";
            }
            else if (isCorruptedRow) {
                // Full corruption line
                line += colorize(glitchChar(r * cols + c + tick), colors.accent[0]);
            }
            else {
                // Random chance to glitch each char based on stability
                const glitchChance = (1 - stability) * 0.4;
                const hash = (r * 131 + c * 97 + tick * 37) % 100;
                if (hash < glitchChance * 100) {
                    // Show glitch char
                    const glitchColor = hash % 2 === 0 ? colors.accent[0] : colors.accent[1];
                    line += colorize(glitchChar(hash), glitchColor);
                }
                else {
                    line += colorize(ch, grad[c % grad.length]);
                }
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=glitch.js.map