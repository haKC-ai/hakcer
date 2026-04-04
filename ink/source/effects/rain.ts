/**
 * Rain effect — characters fall from the top like rain, settling into final positions.
 */

import { colorize, gradient } from "../colors.js";
import type { EffectConfig, EffectFn, EffectFrame } from "./types.js";

export const rain: EffectFn = (config: EffectConfig, tick: number): EffectFrame => {
  const { grid, colors, rows, cols } = config;
  const done = tick >= rows + 15;

  const grad = gradient([...colors.primary, colors.accent[0]], cols);

  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    let line = "";
    const row = grid[r] ?? [];
    for (let c = 0; c < cols; c++) {
      const ch = row[c] ?? " ";
      if (ch === " ") {
        line += " ";
        continue;
      }

      // Each column drops at a different speed
      const dropSpeed = 1 + ((c * 17 + 5) % 3);
      const dropDelay = (c * 11 + 3) % 8;
      const dropTick = Math.max(0, tick - dropDelay);
      const currentDropY = Math.min(r, Math.floor(dropTick * dropSpeed));

      if (currentDropY >= r) {
        // Settled in final position
        line += colorize(ch, grad[c % grad.length]!);
      } else if (currentDropY === r - 1) {
        // Just above final — show rain drop
        line += colorize("│", colors.accent[0]);
      } else {
        line += " ";
      }
    }
    lines.push(line);
  }

  return { lines, done };
};
