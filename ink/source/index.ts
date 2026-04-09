/**
 * hakcer-ink — Public API
 *
 * Usage:
 *   import { Banner, setTheme, listEffects } from 'hakcer-ink';
 *
 *   // In your Ink app:
 *   <Banner effect="decrypt" theme="cyberpunk" />
 */

export { Banner } from "./Banner.js";
export type { BannerProps } from "./Banner.js";

export { Showcase } from "./Showcase.js";

export {
  THEMES,
  getTheme,
  setTheme,
  getCurrentTheme,
  listThemes,
} from "./themes.js";
export type { Theme, ThemeColors } from "./themes.js";

export {
  EFFECTS,
  ALL_EFFECTS,
  FAST_EFFECTS,
  MEDIUM_EFFECTS,
  SLOW_EFFECTS,
  listEffects,
  getEffectsBySpeed,
  getRandomEffect,
} from "./effects/index.js";
export type { EffectFn, EffectFrame, EffectConfig, EffectMeta } from "./effects/index.js";

export { HAKCER_ASCII, textToGrid, centerText } from "./ascii.js";
export { gradient, applyGradient, colorize, hexToRgb } from "./colors.js";
