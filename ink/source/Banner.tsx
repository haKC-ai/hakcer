/**
 * Banner — React component that renders animated ASCII art using Ink.
 *
 * Usage:
 *   <Banner />
 *   <Banner effect="decrypt" theme="cyberpunk" />
 *   <Banner customText={myAscii} onComplete={() => console.log('done')} />
 */

import React, { useState, useEffect, useCallback } from "react";
import { Box, Text } from "ink";
import { EFFECTS, getRandomEffect } from "./effects/index.js";
import type { EffectConfig } from "./effects/index.js";
import { getTheme, setTheme as setGlobalTheme } from "./themes.js";
import { HAKCER_ASCII, textToGrid } from "./ascii.js";

export interface BannerProps {
  /** Specific effect name. Random if omitted. */
  effect?: string;
  /** Speed preference for random selection. */
  speedPreference?: "fast" | "medium" | "slow" | "any";
  /** Theme name. Uses current global theme if omitted. */
  theme?: string;
  /** Custom ASCII art text. */
  customText?: string;
  /** Milliseconds between frames. Default 60. */
  frameInterval?: number;
  /** Seconds to hold after animation completes. Default 0 (stays rendered). */
  holdTime?: number;
  /** Callback when animation completes. */
  onComplete?: () => void;
}

export function Banner({
  effect,
  speedPreference = "fast",
  theme,
  customText,
  frameInterval = 60,
  holdTime = 0,
  onComplete,
}: BannerProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const effectName = effect ?? getRandomEffect(speedPreference);

  const render = useCallback(() => {
    if (theme) {
      setGlobalTheme(theme);
    }

    const effectMeta = EFFECTS[effectName];
    if (!effectMeta) {
      throw new Error(
        `Unknown effect: ${effectName}. Available: ${Object.keys(EFFECTS).sort().join(", ")}`
      );
    }

    const themeConfig = getTheme(theme);
    const ascii = customText ?? HAKCER_ASCII;
    const { grid, rows, cols } = textToGrid(ascii);

    const config: EffectConfig = {
      grid,
      colors: themeConfig.colors,
      rows,
      cols,
    };

    return { effectFn: effectMeta.fn, config };
  }, [effectName, theme, customText]);

  useEffect(() => {
    const { effectFn, config } = render();
    let tick = 0;
    let holdTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      const frame = effectFn(config, tick);
      setLines(frame.lines);

      if (frame.done) {
        clearInterval(interval);
        setDone(true);

        if (holdTime > 0) {
          holdTimeout = setTimeout(() => {
            onComplete?.();
          }, holdTime * 1000);
        } else {
          onComplete?.();
        }
      }

      tick++;
    }, frameInterval);

    // Render first frame immediately
    const firstFrame = effectFn(config, 0);
    setLines(firstFrame.lines);

    return () => {
      clearInterval(interval);
      if (holdTimeout) clearTimeout(holdTimeout);
    };
  }, [render, frameInterval, holdTime, onComplete]);

  return (
    <Box flexDirection="column">
      {lines.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  );
}

export default Banner;
