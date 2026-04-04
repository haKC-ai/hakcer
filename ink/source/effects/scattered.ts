/**
 * Scattered effect — characters appear at random positions until fully revealed.
 */

import { colorize, gradient } from "../colors.js";
import type { EffectConfig, EffectFn, EffectFrame } from "./types.js";

// Generate a deterministic shuffle order
function shuffleOrder(rows: number, cols: number): Array<[number, number]> {
  const positions: Array<[number, number]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      positions.push([r, c]);
    }
  }
  // Seeded shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = (i * 2654435761) % (i + 1); // Knuth multiplicative hash
    [positions[i], positions[j]] = [positions[j]!, positions[i]!];
  }
  return positions;
}

let cachedOrder: Array<[number, number]> | null = null;
let cachedKey = "";

export const scattered: EffectFn = (config: EffectConfig, tick: number): EffectFrame => {
  const { grid, colors, rows, cols } = config;
  const key = `${rows}x${cols}`;
  if (cachedKey !== key) {
    cachedOrder = shuffleOrder(rows, cols);
    cachedKey = key;
  }
  const order = cachedOrder!;

  const totalChars = rows * cols;
  const charsPerTick = Math.max(3, Math.floor(totalChars / 25));
  const revealedCount = Math.min(totalChars, tick * charsPerTick);
  const done = revealedCount >= totalChars;

  // Build revealed set
  const revealed = new Set<string>();
  for (let i = 0; i < revealedCount; i++) {
    const [r, c] = order[i]!;
    revealed.add(`${r},${c}`);
  }

  const grad = gradient(colors.gradient_stops, cols);

  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    let line = "";
    const row = grid[r] ?? [];
    for (let c = 0; c < cols; c++) {
      const ch = row[c] ?? " ";
      if (ch === " " || revealed.has(`${r},${c}`)) {
        if (ch === " ") {
          line += " ";
        } else {
          line += colorize(ch, grad[c % grad.length]!);
        }
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }

  return { lines, done };
};
