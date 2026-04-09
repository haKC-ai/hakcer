/**
 * Burn effect — text burns into existence from embers, row by row.
 */
import { colorize, gradient } from "../colors.js";
const BURN_CHARS = [".", ":", "░", "▒", "▓", "█"];
export const burn = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const burnLine = tick * 1.2;
    const done = burnLine >= rows + 6;
    const grad = gradient(colors.gradient_stops, cols);
    const burnGrad = gradient(colors.accent, BURN_CHARS.length);
    const lines = [];
    for (let r = 0; r < rows; r++) {
        let line = "";
        const row = grid[r] ?? [];
        const distFromBurn = burnLine - r;
        for (let c = 0; c < cols; c++) {
            const ch = row[c] ?? " ";
            if (ch === " ") {
                line += " ";
            }
            else if (distFromBurn > 5) {
                // Fully revealed
                line += colorize(ch, grad[c % grad.length]);
            }
            else if (distFromBurn > 0) {
                // Burning — show burn stage
                const stage = Math.min(BURN_CHARS.length - 1, Math.floor(distFromBurn));
                line += colorize(BURN_CHARS[stage], burnGrad[stage % burnGrad.length]);
            }
            else {
                line += " ";
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=burn.js.map