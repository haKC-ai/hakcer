```
                 ██████████
                █▓       ░██
                █▒        ██
    █████████████░        █████████████████ ████████████ ████████████      ████████████
   ██         ███░        ███▓▒▒▒▒▒▒▒▒▒▒▒██ █▒▒▒▒▒▒▒▒▓████        █████████▓          ▒█
   ██         ███         ███▒▒▒▒▒▒▒▒▒▒▒▒▓██████████████▓        ███▓▒      ▒▓░       ▒█
   ██         ███        ░██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓██▓▒▒▒▒▒▒▒▒█▓        ███░       ░██░       ▒█
   ██         ███        ▒██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▒▒▒▒▒▒▒▓▒        ██  ▓        ██░       ▓█
   ██         ██▓        ███▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▓▒       ██   █        ██░       ▓
   ██         ██▒        ██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓▒▒▒▒▒▒▒▓▒      ██    █        ▓█████████
   ██                    ██▒▒▒▒▒▒▒▒█▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▒   ▒███████ █░       ░▓        █
   ██         ░░         ██▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█ ▓        ░█ ▓       ░▒       ░█
   ██         ██░       ░█▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█ █░        ▒ █                ░█
   ██         ██        ▓█▒▒▒▒▒▒▒▒▒██▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓█ █░        ▒ █░               ▒█
    ██████████  ███████████▓██▓▓█▓█  █▓▒▒▒▒▒▒▒▒▒▓██▓██   █▓▓▓▓▓▓▓█    █▓▓▓▓▓▓▓▓▓▓▓▓▓▓██
  .:/====================█▓██▓██=========████▓█▓█ ███======> [ P R E S E N T S ] ====\:.
        /\                 ██▓██           █▓▓▓██ ██
 _ __  /  \__________________█▓█_____________██▓██______________________________ _  _    _
_ __ \/ /\____________________██_____________ ███________ _________ __ _______ _
    \  /         T H E   P I N A C L E    O F   H A K C I N G   Q U A L I T Y
     \/
```

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

  [*] Drop-in animated ASCII banners for Python CLI tools
  [*] Custom art support - bring your own designs
  [*] 29 terminal effects from subtle to SICK
  [*] 9 color themes: Tokyo Night, Cyberpunk, Neon, Matrix+
  [*] Zero config - works out the box

  ─────────────────────────────────────────────────────────
```

## [INSTALLATION]

```bash
pip install hakcer
```

## [QUICK START]

### Basic Usage

```python
from hakcer import show_banner

# Default neon theme, random fast effect
show_banner()

# Your CLI tool code here
print("Welcome to the grid...")
```

### With Themes

```python
from hakcer import show_banner, set_theme

# Tokyo Night aesthetic
set_theme("tokyo_night")
show_banner()

# Cyberpunk 2077 vibes
set_theme("cyberpunk")
show_banner()

# Full neon mode
set_theme("neon")
show_banner(effect_name="synthgrid")
```

### Custom ASCII Art

```python
# Load your own art
show_banner(custom_file="my_logo.txt", theme="cyberpunk")

# Or inline
banner = """
╔═══════════════╗
║  MY COOL APP  ║
╚═══════════════╝
"""
show_banner(custom_text=banner, effect_name="decrypt")
```

## [THEMES]

```
┌─────────────────┬──────────────────────────────────┬────────────────────┐
│ Theme           │ Description                      │ Colors             │
├─────────────────┼──────────────────────────────────┼────────────────────┤
│ synthwave       │ Classic retro cyan/magenta/purp  │ Retro synth vibes  │
│ tokyo_night     │ Dark blue Tokyo aesthetic        │ Modern clean       │
│ tokyo_storm     │ Deeper blue variant              │ Stormy nights      │
│ neon            │ Bright electric [DEFAULT]        │ Full send neon     │
│ cyberpunk       │ Yellow/pink CP2077 style         │ High contrast      │
│ matrix          │ Classic green matrix             │ Terminal classic   │
│ dracula         │ Popular Dracula palette          │ Dark vampire       │
│ nord            │ Arctic bluish tones              │ Professional       │
│ gruvbox         │ Retro warm colors                │ Cozy terminal      │
└─────────────────┴──────────────────────────────────┴────────────────────┘
```

## [EFFECTS]

**FAST** (<2s) - Production ready
```
decrypt, expand, print, slide, wipe, colorshift,
scattered, random_sequence, pour, errorcorrect
```

**MEDIUM** (2-4s) - Balanced
```
beams, binarypath, burn, crumble, overflow,
rain, spray, unstable, vhstape, waves
```

**SLOW** (4s+) - Maximum flex
```
blackhole, bouncyballs, fireworks, matrix,
orbittingvolley, rings, spotlights, swarm, synthgrid
```

### Speed Control

```python
# Fast for production
show_banner(speed_preference="fast")

# Medium for balance
show_banner(speed_preference="medium")

# Slow for maximum effect
show_banner(speed_preference="slow")

# Specific effect
show_banner(effect_name="synthgrid")
```

## [DEMO]

Run the interactive showcase:

```bash
python showcase.py
```

Features:
```
[1] Showcase All Effects - Record-ready demo (261 combos!)
[2] Theme Gallery - Browse all themes
[3] Quick Demo - Single random fast effect
[4] Custom Effect - Pick theme + effect combo
[5] Effect Browser - Interactive selector
[6] Speed Test - Compare fast/medium/slow
[7] Info - List all available options
[8] Synthwave Mode - Ultimate experience
```

## [CLI INTEGRATION]

```python
#!/usr/bin/env python3
"""my_tool.py - Example CLI tool"""
import sys
from hakcer import show_banner, set_theme

def main():
    # Check if terminal
    if sys.stdout.isatty():
        set_theme("neon")
        show_banner(speed_preference="fast", hold_time=0.5)

    # Your tool logic
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

### Smart Terminal Detection

```python
import sys
import os
from hakcer import show_banner, set_theme

# Check env vars
show_banner_enabled = os.getenv("SHOW_BANNER", "true").lower() == "true"
is_interactive = sys.stdout.isatty()

if show_banner_enabled and is_interactive:
    theme = os.getenv("HAKCER_THEME", "neon")
    set_theme(theme)
    show_banner(speed_preference="fast", hold_time=0.5)
```

## [API REFERENCE]

### show_banner()
Display animated ASCII banner.

**Parameters:**
- `effect_name` (str, optional): Specific effect name
- `speed_preference` (str, optional): "fast", "medium", "slow", "any" (default: "fast")
- `hold_time` (float, optional): Seconds to hold final frame (default: 1.5)
- `clear_after` (bool, optional): Clear terminal after (default: False)
- `theme` (str, optional): Theme name (default: current global theme)
- `custom_text` (str, optional): Custom ASCII art text
- `custom_file` (str, optional): Path to custom ASCII art file

### set_theme(theme_name)
Set global theme for all banners.

### list_themes()
Get list of available theme names.

### list_effects()
Get list of available effect names.

## [CUSTOM ASCII ART]

### Online Generators
- http://patorjk.com/software/taag/ - Text to ASCII (BEST!)
- https://ascii-generator.site/ - Image to ASCII
- https://ascii.co.uk/art/ - ASCII Art Gallery

### Recommended Fonts
```
ANSI Shadow, Bloody, Doom, Graffiti,
ANSI Regular, Block, Banner3, 3D-ASCII
```

### Usage

```python
from hakcer import show_banner, set_theme

# From file
show_banner(
    custom_file="assets/logo.txt",
    effect_name="decrypt",
    theme="cyberpunk",
    hold_time=1.0
)

# Inline
my_banner = """
 ███╗   ███╗██╗   ██╗     █████╗ ██████╗ ██████╗
 ████╗ ████║╚██╗ ██╔╝    ██╔══██╗██╔══██╗██╔══██╗
 ██╔████╔██║ ╚████╔╝     ███████║██████╔╝██████╔╝
 ██║╚██╔╝██║  ╚██╔╝      ██╔══██║██╔═══╝ ██╔═══╝
 ██║ ╚═╝ ██║   ██║       ██║  ██║██║     ██║
 ╚═╝     ╚═╝   ╚═╝       ╚═╝  ╚═╝╚═╝     ╚═╝
"""
show_banner(custom_text=my_banner, theme="neon")
```

## [REQUIREMENTS]

```
Python 3.8+
terminaltexteffects >= 0.11.0
rich >= 13.0.0
```

## [LINKS]

- PyPI: https://pypi.org/project/hakcer/
- GitHub: https://github.com/haKC-ai/hakcer
- Issues: https://github.com/haKC-ai/hakcer/issues

## [CREDITS]

Built with:
- terminaltexteffects - Terminal animation engine
- rich - Terminal formatting

## [LICENSE]

MIT License - see LICENSE file

```
─────────────────────────────────────────────────────────
              M A D E   B Y   h a K C e r
         T H E   P I N N A C L E   O F   Q U A L I T Y
─────────────────────────────────────────────────────────
           Transform CLI tools from boring to LEGENDARY
            pip install hakcer && watch the magic happen
─────────────────────────────────────────────────────────
```
