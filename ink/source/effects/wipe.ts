/**
 * Wipe effect — reveals text with a diagonal wipe from top-left to bottom-right.
 */

import { colorize, gradient } from "../colors.js";
import type { EffectConfig, EffectFn, EffectFrame } from "./types.js";

export const wipe: EffectFn = (config: EffectConfig, tick: number): EffectFrame => {
  const { grid, colors, rows, cols } = config;
  const maxDist = rows + cols;
  const frontier = tick * 2;
  const done = frontier >= maxDist + 6;

  const grad = gradient(colors.gradient_stops, cols);

  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    let line = "";
    const row = grid[r] ?? [];
    for (let c = 0; c < cols; c++) {
      const ch = row[c] ?? " ";
      const dist = r + c;

      if (ch === " ") {
        line += " ";
      } else if (dist <= frontier) {
        line += colorize(ch, grad[c % grad.length]!);
      } else if (dist <= frontier + 3) {
        // Leading edge glow
        line += colorize("░", colors.accent[0]);
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }

  return { lines, done };
};
