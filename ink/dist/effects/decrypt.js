/**
 * Decrypt effect — characters cycle through random cipher glyphs before revealing.
 */
import { colorize, gradient } from "../colors.js";
const CIPHER_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
// Pre-generate a seeded random map so it's deterministic per position
function cipherChar(row, col, tick) {
    const idx = (row * 137 + col * 97 + tick * 31) % CIPHER_CHARS.length;
    return CIPHER_CHARS[idx];
}
export const decrypt = (config, tick) => {
    const { grid, colors, rows, cols } = config;
    const totalChars = rows * cols;
    const revealSpeed = Math.max(1, Math.floor(totalChars / 40));
    const revealedCount = Math.min(totalChars, tick * revealSpeed);
    const done = revealedCount >= totalChars;
    // Build reveal order (left-to-right, top-to-bottom with slight randomization)
    const grad = gradient(colors.gradient_stops, cols);
    const cipherGrad = gradient(colors.accent, cols);
    const lines = [];
    for (let r = 0; r < rows; r++) {
        let line = "";
        const row = grid[r] ?? [];
        for (let c = 0; c < cols; c++) {
            const ch = row[c] ?? " ";
            const charIndex = r * cols + c;
            if (ch === " ") {
                line += " ";
            }
            else if (charIndex < revealedCount) {
                // Revealed — show real char with gradient color
                line += colorize(ch, grad[c % grad.length]);
            }
            else if (charIndex < revealedCount + revealSpeed * 3) {
                // Decrypting — show cipher char with accent color
                line += colorize(cipherChar(r, c, tick), cipherGrad[c % cipherGrad.length]);
            }
            else {
                // Not yet reached — show cipher char dimmed
                line += colorize(cipherChar(r, c, 0), colors.primary[2]);
            }
        }
        lines.push(line);
    }
    return { lines, done };
};
//# sourceMappingURL=decrypt.js.map