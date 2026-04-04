# hakcer-ink

> Animated ASCII banners with terminal effects and themes — [Ink](https://github.com/vadimdemedes/ink) (React for CLI) edition.

TypeScript port of [hakcer](https://github.com/haKC-ai/hakcer) — the Python terminal banner library. Built with Ink (React), so you can compose animated banners into any Node.js CLI app as React components.

## Features

- **11 animated effects**: decrypt, wipe, colorshift, slide, pour, scattered, rain, burn, glitch, matrix, waves
- **9 color themes**: synthwave, tokyo_night, cyberpunk, matrix, dracula, nord, gruvbox, neon, and more
- **React component API** — drop `<Banner />` into any Ink app
- **Interactive showcase** — demo menu to preview all effects and themes
- **Custom ASCII art** — bring your own banners
- **Zero-config** — works out of the box with sensible defaults

## Install

```bash
npm install hakcer-ink
```

## CLI Usage

```bash
# Random effect with default theme
npx hakcer-ink

# Specific effect and theme
npx hakcer-ink --effect decrypt --theme cyberpunk

# Interactive showcase
npx hakcer-ink --showcase

# List all effects and themes
npx hakcer-ink --list
```

## Component API

```tsx
import React from 'react';
import { render } from 'ink';
import { Banner } from 'hakcer-ink';

// Random fast effect
render(<Banner />);

// Specific effect and theme
render(<Banner effect="matrix" theme="cyberpunk" />);

// Custom ASCII art with callback
render(
  <Banner
    customText={myAsciiArt}
    effect="decrypt"
    theme="synthwave"
    onComplete={() => console.log('Animation done!')}
  />
);
```

### `<Banner>` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `effect` | `string` | random | Effect name |
| `theme` | `string` | `"neon"` | Theme name |
| `speedPreference` | `"fast" \| "medium" \| "slow" \| "any"` | `"fast"` | Speed category for random selection |
| `customText` | `string` | haKCer logo | Custom ASCII art |
| `frameInterval` | `number` | `60` | Milliseconds between frames |
| `holdTime` | `number` | `0` | Seconds to hold after animation |
| `onComplete` | `() => void` | — | Called when animation finishes |

### Showcase Component

```tsx
import { render } from 'ink';
import { Showcase } from 'hakcer-ink';

render(<Showcase />);
```

## Theme & Effect APIs

```ts
import { setTheme, listThemes, listEffects, getEffectsBySpeed } from 'hakcer-ink';

setTheme('cyberpunk');
console.log(listThemes());      // ['cyberpunk', 'dracula', ...]
console.log(listEffects());     // ['burn', 'colorshift', ...]
console.log(getEffectsBySpeed('fast')); // ['colorshift', 'decrypt', ...]
```

## Effects

| Effect | Speed | Description |
|--------|-------|-------------|
| decrypt | fast | Characters cycle through cipher glyphs before revealing |
| wipe | fast | Diagonal wipe from top-left to bottom-right |
| colorshift | fast | Gradient cycles through theme colors |
| slide | fast | Text slides in from the left with stagger |
| pour | fast | Characters pour down column by column |
| scattered | medium | Characters appear at random positions |
| rain | medium | Characters fall like rain into positions |
| burn | medium | Text burns into existence from embers |
| glitch | medium | VHS-style glitch distortion settling into text |
| matrix | slow | Matrix-style rain revealing the text |
| waves | slow | Sine wave sweeps across revealing text |

## Themes

synthwave, tokyo_night, tokyo_night_storm, neon, cyberpunk, matrix, dracula, nord, gruvbox

## License

MIT
