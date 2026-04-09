/**
 * Matrix effect — characters rain down to reveal the text, Matrix-style.
 */
import { colorize, gradient } from "../colors.js";
const MATRIX_CHARS = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789:・.\"=*+-<>¦╌";
function matrixChar(seed) {
    return MATRIX_CHARS[seed % MATRIX_CHARS.length];
}
// Per-column drop positions (seeded by column index)
function dropY(col, tick, rows) {
    const speed = 1 + (col * 7 + 13) % 3;
    const offset = (col * 23 + 7) % rows;
    return (tick * speed + offset) % (rows + 8);
}
export const matrix = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const revealTick = Math.max(0, tick - 10);
    const revealRow = Math.min(rows, Math.floor(revealTick * 1.5));
    const done = revealRow >= rows && tick > rows + 15;
    const grad = gradient(colors.primary.slice(0, 2), rows);
    const lines = [];
    for (let r = 0; r < rows; r++) {
        let line = "";
        const row = grid[r] ?? [];
        for (let c = 0; c < cols; c++) {
            const ch = row[c] ?? " ";
            const dy = dropY(c, tick, rows);
            if (r <= revealRow && ch !== " ") {
                // Revealed text
                line += colorize(ch, grad[r % grad.length]);
            }
            else if (Math.abs(r - dy) === 0) {
                // Drop head — bright
                line += colorize(matrixChar(r * cols + c + tick), colors.primary[0]);
            }
            else if (r < dy && r > dy - 6) {
                // Drop tail — fading
                const fade = dy - r;
                const tailColor = fade < 3 ? colors.primary[0] : colors.primary[1];
                line += colorize(matrixChar(r * cols + c + tick * 3), tailColor);
            }
            else {
                line += " ";
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=matrix.js.map