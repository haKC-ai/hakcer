/**
 * Corruption mode: every Nth frame (default 1 in 50) the output is replaced
 * with a glitch message on a red background for exactly one frame.
 */
const DEFAULT_MESSAGES = [
    "SEGFAULT",
    "KERNEL PANIC - NOT SYNCING",
    "STACK SMASHING DETECTED",
    "GURU MEDITATION",
    "BSOD",
    "ABORT TRAP 6",
];
export function maybeCorrupt(input, tick, width, messages = DEFAULT_MESSAGES, rate = 50) {
    // Deterministic seed: hash tick; fire roughly once per `rate` frames.
    const h = (tick * 2654435761) >>> 0;
    if (h % rate !== 7)
        return input;
    const msg = messages[h % messages.length] ?? DEFAULT_MESSAGES[0];
    const padded = ` ${msg} `.padEnd(width, " ").slice(0, width);
    // Bright red background, white bold text
    return `\x1b[1;97;41m${padded}\x1b[0m`;
}
//# sourceMappingURL=corruption.js.map