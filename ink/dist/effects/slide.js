/**
 * Slide effect — text slides in from the left.
 */
import { colorize, gradient } from "../colors.js";
export const slide = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const slideOffset = Math.max(0, cols - tick * 4);
    const done = slideOffset <= 0;
    const grad = gradient(colors.primary, cols);
    const lines = [];
    for (let r = 0; r < rows; r++) {
        const row = grid[r] ?? [];
        // Each row has a staggered offset
        const rowOffset = Math.max(0, slideOffset + r * 2);
        if (rowOffset >= cols) {
            lines.push(" ".repeat(cols));
            continue;
        }
        let line = "";
        for (let c = 0; c < cols; c++) {
            const srcCol = c - rowOffset;
            if (srcCol < 0 || srcCol >= cols) {
                line += " ";
            }
            else {
                const ch = row[srcCol] ?? " ";
                if (ch === " ") {
                    line += " ";
                }
                else {
                    line += colorize(ch, grad[srcCol % grad.length]);
                }
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=slide.js.map