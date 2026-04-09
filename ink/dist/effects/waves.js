/**
 * Waves effect — text revealed with a sine wave pattern sweeping across.
 */
import { colorize, gradient } from "../colors.js";
export const waves = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const waveProgress = tick * 3;
    const done = waveProgress >= cols + 30;
    const grad = gradient(colors.primary, cols);
    const waveSymbols = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂", "▁"];
    const lines = [];
    for (let r = 0; r < rows; r++) {
        let line = "";
        const row = grid[r] ?? [];
        for (let c = 0; c < cols; c++) {
            const ch = row[c] ?? " ";
            // Wave front position for this row
            const waveOffset = Math.sin(r * 0.5) * 5;
            const waveFront = waveProgress + waveOffset;
            if (ch === " ") {
                // Show wave in empty space near the front
                if (Math.abs(c - waveFront) < waveSymbols.length / 2 && c < waveFront) {
                    const waveIdx = Math.floor(Math.abs(c - waveFront + waveSymbols.length / 2)) % waveSymbols.length;
                    line += colorize(waveSymbols[waveIdx], colors.accent[0]);
                }
                else {
                    line += " ";
                }
            }
            else if (c < waveFront) {
                // Revealed
                line += colorize(ch, grad[c % grad.length]);
            }
            else {
                line += " ";
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=waves.js.map