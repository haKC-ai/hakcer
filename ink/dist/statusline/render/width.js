/**
 * Terminal width detection: COLUMNS env → tty columns → 80 fallback.
 */
export function detectWidth() {
    const envCols = process.env.COLUMNS;
    if (envCols) {
        const n = parseInt(envCols, 10);
        if (n > 0)
            return n;
    }
    if (process.stdout.isTTY && process.stdout.columns) {
        return process.stdout.columns;
    }
    return 80;
}
//# sourceMappingURL=width.js.map