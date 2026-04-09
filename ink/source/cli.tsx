#!/usr/bin/env node

/**
 * hakcer-ink CLI — animated ASCII banners from the terminal.
 *
 * Usage:
 *   hakcer-ink                     # random effect, default theme
 *   hakcer-ink --effect decrypt    # specific effect
 *   hakcer-ink --theme cyberpunk   # specific theme
 *   hakcer-ink --showcase          # interactive showcase menu
 *   hakcer-ink --list              # list effects and themes
 */

import React from "react";
import { render } from "ink";
import meow from "meow";
import { Banner } from "./Banner.js";
import { Showcase } from "./Showcase.js";
import { listEffects, getEffectsBySpeed, ALL_EFFECTS } from "./effects/index.js";
import { listThemes, THEMES } from "./themes.js";

const cli = meow(
  `
  Usage
    $ hakcer-ink [options]

  Options
    --effect, -e       Effect name (random if omitted)
    --theme, -t        Theme name (default: neon)
    --speed, -s        Speed preference: fast, medium, slow, any
    --showcase         Launch interactive showcase menu
    --list             List all effects and themes
    --hold             Hold time in seconds after animation (default: 1.5)

  Examples
    $ hakcer-ink
    $ hakcer-ink --effect decrypt --theme cyberpunk
    $ hakcer-ink --showcase
    $ hakcer-ink --list
`,
  {
    importMeta: import.meta,
    flags: {
      effect: { type: "string", shortFlag: "e" },
      theme: { type: "string", shortFlag: "t", default: "neon" },
      speed: { type: "string", shortFlag: "s", default: "fast" },
      showcase: { type: "boolean", default: false },
      list: { type: "boolean", default: false },
      hold: { type: "number", default: 1.5 },
    },
  }
);

if (cli.flags.list) {
  console.log("\n  haKCer Ink — Effects & Themes\n");

  console.log("  THEMES:");
  for (const name of listThemes()) {
    const t = THEMES[name]!;
    console.log(`    ${name.padEnd(20)} ${t.description}`);
  }

  console.log("\n  EFFECTS:");
  for (const speed of ["fast", "medium", "slow"] as const) {
    const effects = getEffectsBySpeed(speed);
    const label = speed.toUpperCase();
    console.log(`    ${label}: ${effects.join(", ")}`);
  }

  console.log("");
  process.exit(0);
}

if (cli.flags.showcase) {
  render(<Showcase />);
} else {
  const { waitUntilExit } = render(
    <Banner
      effect={cli.flags.effect}
      theme={cli.flags.theme}
      speedPreference={cli.flags.speed as "fast" | "medium" | "slow" | "any"}
      holdTime={cli.flags.hold}
      onComplete={() => {
        setTimeout(() => process.exit(0), 100);
      }}
    />
  );

  waitUntilExit();
}
