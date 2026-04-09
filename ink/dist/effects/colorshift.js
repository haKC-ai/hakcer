/**
 * ColorShift effect — text is fully visible but the gradient cycles through colors.
 */
import { colorize, gradient } from "../colors.js";
export const colorshift = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const cycleLength = 30;
    const done = tick >= cycleLength;
    // Shift gradient offset each tick
    const allStops = [...colors.gradient_stops, colors.accent[0], ...colors.primary];
    const offset = tick % allStops.length;
    const shifted = [...allStops.slice(offset), ...allStops.slice(0, offset)];
    const grad = gradient(shifted.slice(0, 3), cols);
    const lines = [];
    for (let r = 0; r < rows; r++) {
        let line = "";
        const row = grid[r] ?? [];
        for (let c = 0; c < cols; c++) {
            const ch = row[c] ?? " ";
            if (ch === " ") {
                line += " ";
            }
            else {
                line += colorize(ch, grad[c % grad.length]);
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=colorshift.js.map