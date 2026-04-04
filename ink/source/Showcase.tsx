/**
 * Showcase — Interactive demo menu for haKCer Ink.
 * Port of the Python showcase.py using Ink components.
 */

import React, { useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { Banner } from "./Banner.js";
import { THEMES, listThemes, getTheme } from "./themes.js";
import { ALL_EFFECTS, FAST_EFFECTS, MEDIUM_EFFECTS, SLOW_EFFECTS, getRandomEffect } from "./effects/index.js";

type Screen =
  | { type: "menu" }
  | { type: "banner"; effect: string; theme: string; next?: Screen }
  | { type: "showcase"; index: number }
  | { type: "themes" }
  | { type: "effects" }
  | { type: "info" }
  | { type: "synthwave"; index: number };

const SYNTHWAVE_COMBOS: Array<[string, string]> = [
  ["synthwave", "decrypt"],
  ["cyberpunk", "matrix"],
  ["neon", "glitch"],
  ["tokyo_night", "waves"],
  ["dracula", "burn"],
];

export function Showcase() {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>({ type: "menu" });
  const [menuTheme] = useState(() => {
    const themes = listThemes();
    return themes[Math.floor(Math.random() * themes.length)]!;
  });

  const themeColors = THEMES[menuTheme]!.colors;
  const primary = `#${themeColors.primary[0]}`;
  const secondary = `#${themeColors.primary[1]}`;
  const accent = `#${themeColors.accent[0]}`;

  useInput((input, key) => {
    if (screen.type === "menu") {
      switch (input) {
        case "1":
          setScreen({ type: "showcase", index: 0 });
          break;
        case "2":
          setScreen({ type: "themes" });
          break;
        case "3":
          setScreen({
            type: "banner",
            effect: getRandomEffect("fast"),
            theme: "synthwave",
          });
          break;
        case "4":
          setScreen({ type: "effects" });
          break;
        case "5":
          setScreen({ type: "info" });
          break;
        case "6":
          setScreen({ type: "synthwave", index: 0 });
          break;
        case "q":
          exit();
          break;
      }
    } else if (screen.type === "banner") {
      // Any key returns to menu (or next screen)
      setScreen(screen.next ?? { type: "menu" });
    } else if (screen.type === "themes") {
      // Number keys preview themes
      const themes = listThemes();
      const idx = parseInt(input) - 1;
      if (idx >= 0 && idx < themes.length) {
        setScreen({
          type: "banner",
          effect: getRandomEffect("fast"),
          theme: themes[idx]!,
          next: { type: "themes" },
        });
      } else if (key.escape || input === "q") {
        setScreen({ type: "menu" });
      }
    } else if (screen.type === "effects") {
      if (key.escape || input === "q") {
        setScreen({ type: "menu" });
      }
      // Number keys mapped to effect categories for quick preview
      if (input === "f") {
        setScreen({
          type: "banner",
          effect: getRandomEffect("fast"),
          theme: menuTheme,
          next: { type: "effects" },
        });
      } else if (input === "m") {
        setScreen({
          type: "banner",
          effect: getRandomEffect("medium"),
          theme: menuTheme,
          next: { type: "effects" },
        });
      } else if (input === "s") {
        setScreen({
          type: "banner",
          effect: getRandomEffect("slow"),
          theme: menuTheme,
          next: { type: "effects" },
        });
      }
    } else if (screen.type === "info") {
      if (key.escape || input === "q" || key.return) {
        setScreen({ type: "menu" });
      }
    } else if (screen.type === "showcase") {
      // Auto-advance handled by onComplete, but allow skip
      if (key.escape || input === "q") {
        setScreen({ type: "menu" });
      }
    } else if (screen.type === "synthwave") {
      if (key.escape || input === "q") {
        setScreen({ type: "menu" });
      }
    }
  });

  // ─── Menu ───
  if (screen.type === "menu") {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text bold color={primary}>
          ╔══════════════════════════════════════════════════════════╗
        </Text>
        <Text bold color={primary}>
          ║          haKCer Ink — Synthwave Demo & Showcase         ║
        </Text>
        <Text bold color={primary}>
          ╚══════════════════════════════════════════════════════════╝
        </Text>
        <Text> </Text>
        <Box flexDirection="column" paddingLeft={4}>
          <Text>
            <Text color={accent} bold>[1]</Text>
            <Text color={secondary}> Showcase All</Text>
            <Text dimColor>    — Cycle through all effect + theme combos</Text>
          </Text>
          <Text>
            <Text color={accent} bold>[2]</Text>
            <Text color={secondary}> Theme Gallery</Text>
            <Text dimColor>   — Browse and preview themes</Text>
          </Text>
          <Text>
            <Text color={accent} bold>[3]</Text>
            <Text color={secondary}> Quick Demo</Text>
            <Text dimColor>      — Random fast effect</Text>
          </Text>
          <Text>
            <Text color={accent} bold>[4]</Text>
            <Text color={secondary}> Effect Browser</Text>
            <Text dimColor>  — Browse effects by speed</Text>
          </Text>
          <Text>
            <Text color={accent} bold>[5]</Text>
            <Text color={secondary}> Info</Text>
            <Text dimColor>            — List all themes & effects</Text>
          </Text>
          <Text>
            <Text color={accent} bold>[6]</Text>
            <Text color={secondary}> Synthwave Mode</Text>
            <Text dimColor> — Ultimate synthwave experience</Text>
          </Text>
          <Text>
            <Text color={accent} bold>[q]</Text>
            <Text color={secondary}> Exit</Text>
          </Text>
        </Box>
        <Text> </Text>
        <Text dimColor>  Menu theme: {menuTheme}</Text>
      </Box>
    );
  }

  // ─── Banner view ───
  if (screen.type === "banner") {
    return (
      <Box flexDirection="column">
        <Banner
          effect={screen.effect}
          theme={screen.theme}
          onComplete={() => {
            // Stay rendered, user presses key to go back
          }}
        />
        <Text> </Text>
        <Text dimColor>
          [{screen.theme} × {screen.effect}] Press any key to go back
        </Text>
      </Box>
    );
  }

  // ─── Showcase ───
  if (screen.type === "showcase") {
    const themes = listThemes();
    const totalCombos = themes.length * ALL_EFFECTS.length;
    const idx = screen.index;

    if (idx >= totalCombos) {
      return (
        <Box flexDirection="column" paddingX={2}>
          <Text bold color="green">SHOWCASE COMPLETE!</Text>
          <Text>Displayed {totalCombos} effect combinations.</Text>
          <Text dimColor>Press any key to return to menu</Text>
        </Box>
      );
    }

    const themeIdx = Math.floor(idx / ALL_EFFECTS.length);
    const effectIdx = idx % ALL_EFFECTS.length;
    const currentTheme = themes[themeIdx]!;
    const currentEffect = ALL_EFFECTS[effectIdx]!;

    return (
      <Box flexDirection="column">
        <Text bold color={accent}>
          ━━━ {idx + 1}/{totalCombos} ━━━
        </Text>
        <Text>
          <Text color="yellow">Theme:</Text> {currentTheme}{"  "}
          <Text color="cyan">Effect:</Text> {currentEffect}
        </Text>
        <Banner
          effect={currentEffect}
          theme={currentTheme}
          holdTime={1.5}
          onComplete={() => {
            setScreen({ type: "showcase", index: idx + 1 });
          }}
        />
      </Box>
    );
  }

  // ─── Theme Gallery ───
  if (screen.type === "themes") {
    const themes = listThemes();
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text bold color={primary}>THEME GALLERY</Text>
        <Text> </Text>
        {themes.map((name, i) => {
          const t = THEMES[name]!;
          return (
            <Text key={name}>
              <Text color={accent} bold>[{i + 1}]</Text>
              <Text color={`#${t.colors.primary[0]}`}> {name}</Text>
              <Text dimColor> — {t.description}</Text>
            </Text>
          );
        })}
        <Text> </Text>
        <Text dimColor>Press number to preview, [q] to go back</Text>
      </Box>
    );
  }

  // ─── Effect Browser ───
  if (screen.type === "effects") {
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text bold color={primary}>EFFECT BROWSER</Text>
        <Text> </Text>
        <Text bold color="green">FAST ({FAST_EFFECTS.length})</Text>
        <Text>  {FAST_EFFECTS.join(" | ")}</Text>
        <Text> </Text>
        <Text bold color="yellow">MEDIUM ({MEDIUM_EFFECTS.length})</Text>
        <Text>  {MEDIUM_EFFECTS.join(" | ")}</Text>
        <Text> </Text>
        <Text bold color="red">SLOW ({SLOW_EFFECTS.length})</Text>
        <Text>  {SLOW_EFFECTS.join(" | ")}</Text>
        <Text> </Text>
        <Text dimColor>[f] random fast  [m] random medium  [s] random slow  [q] back</Text>
      </Box>
    );
  }

  // ─── Info ───
  if (screen.type === "info") {
    const themes = listThemes();
    return (
      <Box flexDirection="column" paddingX={2} paddingY={1}>
        <Text bold color={primary}>haKCer Ink — Info</Text>
        <Text> </Text>
        <Text bold>Themes ({themes.length}):</Text>
        <Text>  {themes.join(", ")}</Text>
        <Text> </Text>
        <Text bold>Effects ({ALL_EFFECTS.length}):</Text>
        <Text>  {ALL_EFFECTS.sort().join(", ")}</Text>
        <Text> </Text>
        <Text bold>Speed categories:</Text>
        <Text>  Fast: {FAST_EFFECTS.length}  Medium: {MEDIUM_EFFECTS.length}  Slow: {SLOW_EFFECTS.length}</Text>
        <Text> </Text>
        <Text dimColor>Press any key to return</Text>
      </Box>
    );
  }

  // ─── Synthwave Mode ───
  if (screen.type === "synthwave") {
    const idx = screen.index;

    if (idx >= SYNTHWAVE_COMBOS.length) {
      return (
        <Box flexDirection="column" paddingX={2}>
          <Text bold color="green">SYNTHWAVE MODE COMPLETE!</Text>
          <Text>Hope you enjoyed the ride!</Text>
          <Text dimColor>Press any key to return</Text>
        </Box>
      );
    }

    const [comboTheme, comboEffect] = SYNTHWAVE_COMBOS[idx]!;

    return (
      <Box flexDirection="column">
        <Text bold color={accent}>
          ━━━ COMBO {idx + 1}/{SYNTHWAVE_COMBOS.length} ━━━
        </Text>
        <Text>
          <Text color="magenta">{comboTheme}</Text> × <Text color="cyan">{comboEffect}</Text>
        </Text>
        <Banner
          effect={comboEffect}
          theme={comboTheme}
          holdTime={2}
          onComplete={() => {
            setScreen({ type: "synthwave", index: idx + 1 });
          }}
        />
      </Box>
    );
  }

  return null;
}

export default Showcase;
