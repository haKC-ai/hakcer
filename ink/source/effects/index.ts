/**
 * Effect registry — all available effects and their metadata.
 */

import type { EffectMeta, EffectFn } from "./types.js";
export type { EffectFn, EffectFrame, EffectConfig, EffectState, EffectMeta } from "./types.js";

import { decrypt } from "./decrypt.js";
import { wipe } from "./wipe.js";
import { colorshift } from "./colorshift.js";
import { matrix } from "./matrix.js";
import { scattered } from "./scattered.js";
import { slide } from "./slide.js";
import { rain } from "./rain.js";
import { waves } from "./waves.js";
import { burn } from "./burn.js";
import { glitch } from "./glitch.js";
import { pour } from "./pour.js";

export const EFFECTS: Record<string, EffectMeta> = {
  decrypt: {
    name: "decrypt",
    description: "Characters cycle through cipher glyphs before revealing",
    speed: "fast",
    fn: decrypt,
  },
  wipe: {
    name: "wipe",
    description: "Diagonal wipe from top-left to bottom-right",
    speed: "fast",
    fn: wipe,
  },
  colorshift: {
    name: "colorshift",
    description: "Gradient cycles through theme colors",
    speed: "fast",
    fn: colorshift,
  },
  slide: {
    name: "slide",
    description: "Text slides in from the left with stagger",
    speed: "fast",
    fn: slide,
  },
  pour: {
    name: "pour",
    description: "Characters pour down from the top column by column",
    speed: "fast",
    fn: pour,
  },
  scattered: {
    name: "scattered",
    description: "Characters appear at random positions",
    speed: "medium",
    fn: scattered,
  },
  rain: {
    name: "rain",
    description: "Characters fall like rain into final positions",
    speed: "medium",
    fn: rain,
  },
  burn: {
    name: "burn",
    description: "Text burns into existence from embers",
    speed: "medium",
    fn: burn,
  },
  glitch: {
    name: "glitch",
    description: "VHS-style glitch distortion settling into text",
    speed: "medium",
    fn: glitch,
  },
  matrix: {
    name: "matrix",
    description: "Matrix-style rain revealing the text",
    speed: "slow",
    fn: matrix,
  },
  waves: {
    name: "waves",
    description: "Sine wave sweeps across revealing text",
    speed: "slow",
    fn: waves,
  },
};

export const FAST_EFFECTS = Object.values(EFFECTS)
  .filter((e) => e.speed === "fast")
  .map((e) => e.name);

export const MEDIUM_EFFECTS = Object.values(EFFECTS)
  .filter((e) => e.speed === "medium")
  .map((e) => e.name);

export const SLOW_EFFECTS = Object.values(EFFECTS)
  .filter((e) => e.speed === "slow")
  .map((e) => e.name);

export const ALL_EFFECTS = Object.keys(EFFECTS);

export function listEffects(): string[] {
  return ALL_EFFECTS.sort();
}

export function getEffectsBySpeed(speed: "fast" | "medium" | "slow"): string[] {
  const map = { fast: FAST_EFFECTS, medium: MEDIUM_EFFECTS, slow: SLOW_EFFECTS };
  return map[speed] ?? [];
}

export function getRandomEffect(speed?: "fast" | "medium" | "slow" | "any"): string {
  const pool =
    speed === "fast"
      ? FAST_EFFECTS
      : speed === "medium"
        ? MEDIUM_EFFECTS
        : speed === "slow"
          ? SLOW_EFFECTS
          : ALL_EFFECTS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
