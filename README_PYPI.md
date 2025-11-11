# haKCer - Terminal Banner Library

![PyPI](https://img.shields.io/pypi/v/hakcer?style=flat-square&logo=pypi&logoColor=white)
![Python Version](https://img.shields.io/pypi/pyversions/hakcer?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/github/license/haKC-ai/hakcer?style=flat-square)
![Downloads](https://img.shields.io/pypi/dm/hakcer?style=flat-square&logo=pypi&logoColor=white)
![GitHub Stars](https://img.shields.io/github/stars/haKC-ai/hakcer?style=flat-square&logo=github)

```
  NAME.........................................haKCer
  Type...........................Terminal Banner Library
  Platform.............................Python 3.8+ / pip
  Release......................................v1.1.3
  Effects..........................................29x
  Themes............................................9x
  Supplied by.........................haKC.ai / /dev/CØR

  NFO: Drop-in animated ASCII banners for Python CLI tools.
       Custom art support. 29 terminal effects. 9 color themes.
       Zero config. Works out the box.

  ─────────────────────────────────────────────────────────
```

## [WHAT'S NEW - v1.1.x]

**Custom ASCII Art Support**
- Bring your own designs - any ASCII art works
- Load from file or inline
- Works with all 29 effects

**Interactive Demo**
- Synthwave-themed showcase
- Record all 261 effect combinations
- Theme gallery + effect browser

```python
from hakcer import show_banner

# Use your own art
show_banner(custom_file="my_logo.txt", theme="cyberpunk")

# Or inline
banner = """
╔═══════════════╗
║  MY COOL APP  ║
╚═══════════════╝
"""
show_banner(custom_text=banner, effect_name="decrypt")
```

## [INSTALLATION]

```bash
pip install hakcer
```

## [QUICK START]

```python
from hakcer import show_banner

# Default neon theme, random fast effect
show_banner()

# Your application code here
print("Welcome to my CLI tool!")
```

### With Custom Art

```python
from hakcer import show_banner, set_theme

# Your logo
my_logo = """
 ███╗   ███╗██╗   ██╗     █████╗ ██████╗ ██████╗
 ████╗ ████║╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔══██╗
 ██╔████╔██║ ╚████╔╝     ███████║██████╔╝██████╔╝
 ██║╚██╔╝██║  ╚██╔╝      ██╔══██║██╔═══╝ ██╔═══╝
 ██║ ╚═╝ ██║   ██║       ██║  ██║██║     ██║
 ╚═╝     ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝
"""

set_theme("neon")
show_banner(custom_text=my_logo, effect_name="synthgrid")
```

## [FEATURES]

```
[*] 29 Terminal Effects - From subtle to SICK
[*] 9 Beautiful Themes - Tokyo Night, Cyberpunk, Neon, Matrix+
[*] Custom ASCII Art - Use your own logos and designs
[*] Speed Categories - Fast (<2s), Medium (2-4s), Slow (4s+)
[*] Zero Config - Works out the box with sensible defaults
[*] Simple API - Just 2 lines of code to get started
```

## [THEMES]

```python
from hakcer import list_themes, set_theme

# See all themes
print(list_themes())
# ['cyberpunk', 'dracula', 'gruvbox', 'matrix', 'neon',
#  'nord', 'synthwave', 'tokyo_night', 'tokyo_night_storm']

# Use any theme
set_theme("cyberpunk")
show_banner()
```

```
┌─────────────────┬────────────────────────────┬──────────────────┐
│ Theme           │ Description                │ Vibe             │
├─────────────────┼────────────────────────────┼──────────────────┤
│ synthwave       │ Cyan/magenta/purple        │ Retro synth      │
│ tokyo_night     │ Dark blue aesthetic        │ Modern clean     │
│ neon            │ Bright electric [DEFAULT]  │ Full send        │
│ cyberpunk       │ Yellow/pink CP2077 style   │ High contrast    │
│ matrix          │ Classic green matrix       │ Terminal classic │
│ dracula         │ Popular Dracula palette    │ Dark vampire     │
│ nord            │ Arctic bluish tones        │ Professional     │
│ gruvbox         │ Retro warm colors          │ Cozy terminal    │
└─────────────────┴────────────────────────────┴──────────────────┘
```

## [EFFECTS]

### Speed Categories

```python
# Fast effects (<2s) - Production ready
show_banner(speed_preference="fast")

# Medium effects (2-4s) - Balanced
show_banner(speed_preference="medium")

# Slow effects (4s+) - Maximum flex
show_banner(speed_preference="slow")

# Specific effect
show_banner(effect_name="synthgrid")
```

**FAST** (10): `decrypt`, `expand`, `print`, `slide`, `wipe`, `colorshift`, `scattered`, `random_sequence`, `pour`, `errorcorrect`

**MEDIUM** (10): `beams`, `binarypath`, `burn`, `crumble`, `overflow`, `rain`, `spray`, `unstable`, `vhstape`, `waves`

**SLOW** (9): `blackhole`, `bouncyballs`, `fireworks`, `matrix`, `orbittingvolley`, `rings`, `spotlights`, `swarm`, `synthgrid`

## [API REFERENCE]

### show_banner()

Display an animated ASCII banner.

**Parameters:**
- `effect_name` (str, optional): Specific effect to use
- `speed_preference` (str, optional): "fast", "medium", "slow", or "any" (default: "fast")
- `hold_time` (float, optional): Seconds to display final frame (default: 1.5)
- `clear_after` (bool, optional): Clear terminal after animation (default: False)
- `theme` (str, optional): Theme name to use (default: current global theme)
- `custom_text` (str, optional): Custom ASCII art text to display
- `custom_file` (str, optional): Path to file containing custom ASCII art

### set_theme(theme_name)

Set the global theme for all banners.

### list_themes()

Get list of all available theme names.

### list_effects()

Get list of all available effect names.

## [USAGE EXAMPLES]

### CLI Tool Integration

```python
#!/usr/bin/env python3
import sys
from hakcer import show_banner, set_theme

def main():
    if sys.stdout.isatty():
        set_theme("neon")
        show_banner(speed_preference="fast", hold_time=0.5)

    print("Running my tool...")

if __name__ == "__main__":
    main()
```

### With Click Framework

```python
import click
from hakcer import show_banner, set_theme

@click.command()
@click.option('--no-banner', is_flag=True, help='Disable banner')
@click.option('--theme', default='neon', help='Banner theme')
def main(no_banner, theme):
    if not no_banner:
        set_theme(theme)
        show_banner(speed_preference="fast")

    click.echo("Tool running...")

if __name__ == '__main__':
    main()
```

### Environment Variables

```python
import sys
import os
from hakcer import show_banner, set_theme

show_banner_enabled = os.getenv("SHOW_BANNER", "true").lower() == "true"
is_interactive = sys.stdout.isatty()

if show_banner_enabled and is_interactive:
    theme = os.getenv("HAKCER_THEME", "neon")
    set_theme(theme)
    show_banner(speed_preference="fast", hold_time=0.5)
```

## [CUSTOM ASCII ART]

### Online Generators

Use these tools to create your ASCII art:
- **http://patorjk.com/software/taag/** - Text to ASCII (BEST!)
- **https://ascii-generator.site/** - Image to ASCII
- **https://ascii.co.uk/art/** - ASCII Art Gallery

### Recommended Fonts

```
ANSI Shadow, Bloody, Doom, Graffiti,
ANSI Regular, Block, Banner3, 3D-ASCII
```

### Tips

```
[1] Keep it reasonably sized (under 100 lines)
[2] Use box drawing characters: ╔═══╗, ║, ╚═══╝
[3] Test with different effects
[4] Consider color themes when designing
[5] UTF-8 support - full Unicode character support
```

## [REAL-WORLD USE CASES]

```
[*] CLI tool splash screens - Welcome users with style
[*] Loading screens - Make waits more interesting
[*] Error/success messages - Visual feedback
[*] Game title screens - Set the mood
[*] Corporate branding - Professional presence
[*] Seasonal greetings - Holiday themes
```

## [INTERACTIVE DEMO]

The package includes a synthwave-themed interactive demo:

```bash
# Run the demo
python showcase.py
```

Features:
```
[1] Showcase Mode - All 261 effect combinations
[2] Theme Gallery - Browse themes
[3] Custom Effect - Pick combinations
[4] Effect Browser - Explore by speed
[5] Synthwave Mode - Ultimate experience
```

Perfect for recording promotional videos!

## [REQUIREMENTS]

```
Python 3.8+
terminaltexteffects >= 0.11.0
rich >= 13.0.0
```

## [BEST PRACTICES]

```
[1] Provide --no-banner flag for automation
[2] Use fast effects for frequently-run tools
[3] Check TTY before showing banners
[4] Match themes to your tool's aesthetic
[5] Keep custom art reasonably sized
```

## [LINKS]

- **PyPI**: https://pypi.org/project/hakcer/
- **GitHub**: https://github.com/haKC-ai/hakcer
- **Issues**: https://github.com/haKC-ai/hakcer/issues
- **Docs**: https://github.com/haKC-ai/hakcer#readme

## [LICENSE]

MIT License

## [CREDITS]

Built with:
- **terminaltexteffects** - Terminal animation engine
- **rich** - Terminal formatting

```
─────────────────────────────────────────────────────────
              M A D E   B Y   h a K C e r
         T H E   P I N N A C L E   O F   Q U A L I T Y
─────────────────────────────────────────────────────────
           Transform CLI tools from boring to LEGENDARY
─────────────────────────────────────────────────────────
```
