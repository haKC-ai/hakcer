/**
 * Pour effect — characters pour down from the top, filling in column by column.
 */

import { colorize, gradient } from "../colors.js";
import type { EffectConfig, EffectFn, EffectFrame } from "./types.js";

export const pour: EffectFn = (config: EffectConfig, tick: number): EffectFrame => {
  const { grid, colors, rows, cols } = config;
  const columnsRevealed = tick * 3;
  const done = columnsRevealed >= cols;

  const grad = gradient(colors.primary, cols);

  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    let line = "";
    const row = grid[r] ?? [];
    for (let c = 0; c < cols; c++) {
      const ch = row[c] ?? " ";

      if (ch === " ") {
        line += " ";
      } else if (c < columnsRevealed) {
        // Pour animation: chars fall from top
        const pourDelay = Math.max(0, columnsRevealed - c);
        const pourProgress = Math.min(rows, pourDelay * 2);
        if (r <= pourProgress) {
          line += colorize(ch, grad[c % grad.length]!);
        } else {
          line += " ";
        }
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }

  return { lines, done };
};
