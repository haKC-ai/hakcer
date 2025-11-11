# haKCer - Animated ASCII Banner with Themes

**Drop-in animated ASCII banners for your Python CLI tools with customizable themes**

![PyPI](https://img.shields.io/pypi/v/hakcer?style=flat-square&logo=pypi&logoColor=white)
![Python Version](https://img.shields.io/pypi/pyversions/hakcer?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/github/license/haKC-ai/hakcer?style=flat-square)
![Downloads](https://img.shields.io/pypi/dm/hakcer?style=flat-square&logo=pypi&logoColor=white)
![GitHub Stars](https://img.shields.io/github/stars/haKC-ai/hakcer?style=flat-square&logo=github)

Transform your CLI tools with stunning animated ASCII banners featuring 29 terminal effects and 9 beautiful themes!

## What's New in v1.1.0

### Custom ASCII Art Support
Use **ANY ASCII art** you want with haKCer's amazing effects!

```python
from hakcer import show_banner

# Use your own ASCII art from file
show_banner(custom_file="my_logo.txt", theme="cyberpunk")

# Or inline
banner = """
╔═══════════════╗
║  MY COOL APP  ║
╚═══════════════╝
"""
show_banner(custom_text=banner, effect_name="decrypt")
```

### Interactive Synthwave Demo
Run the included demo for an interactive showcase:
```bash
python showcase.py
```

## Quick Start

### Installation

```bash
pip install hakcer
```

### Basic Usage

```python
from hakcer import show_banner

# Show banner with default theme and random fast effect
show_banner()

# Your application code here
print("Welcome to my CLI tool!")
```

### With Custom Art

```python
from hakcer import show_banner, set_theme

# Use your own ASCII art
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

## Features

- **29 Terminal Effects** - From subtle to spectacular animations
- **9 Beautiful Themes** - Tokyo Night, Cyberpunk, Neon, Matrix, Dracula, Nord, Gruvbox, and more
- **Custom ASCII Art** - Use your own logos and designs
- **Speed Categories** - Fast (<2s), Medium (2-4s), Slow (4s+)
- **Zero Config** - Works out of the box with sensible defaults
- **Simple API** - Just 2 lines of code to get started

## Available Themes

```python
from hakcer import list_themes, set_theme

# See all themes
print(list_themes())
# ['synthwave', 'tokyo_night', 'tokyo_night_storm', 'neon',
#  'cyberpunk', 'matrix', 'dracula', 'nord', 'gruvbox']

# Use any theme
set_theme("cyberpunk")
show_banner()
```

| Theme | Description | Perfect For |
|-------|-------------|-------------|
| **synthwave** | Classic cyan/magenta/purple (default) | Retro vibes |
| **tokyo_night** | Dark blue aesthetic | Modern apps |
| **neon** | Bright electric colors | Eye-catching |
| **cyberpunk** | Yellow and pink | Bold statements |
| **matrix** | Classic green | Terminal hackers |
| **dracula** | Popular Dracula palette | Dark themes |
| **nord** | Arctic bluish colors | Professional |
| **gruvbox** | Warm retro colors | Cozy feeling |

## Terminal Effects

### Speed Categories

```python
# Fast effects (<2s) - great for production
show_banner(speed_preference="fast")

# Medium effects (2-4s) - balanced
show_banner(speed_preference="medium")

# Slow effects (4s+) - impressive for demos
show_banner(speed_preference="slow")

# Specific effect
show_banner(effect_name="synthgrid")
```

**Fast Effects (10)**: `decrypt`, `expand`, `print`, `slide`, `wipe`, `colorshift`, `scattered`, `random_sequence`, `pour`, `errorcorrect`

**Medium Effects (10)**: `beams`, `binarypath`, `burn`, `crumble`, `overflow`, `rain`, `spray`, `unstable`, `vhstape`, `waves`

**Slow Effects (9)**: `blackhole`, `bouncyballs`, `fireworks`, `matrix`, `orbittingvolley`, `rings`, `spotlights`, `swarm`, `synthgrid`

## API Reference

### `show_banner()`

Display an animated ASCII banner.

**Parameters:**
- `effect_name` (str, optional): Specific effect to use
- `speed_preference` (str, optional): "fast", "medium", "slow", or "any" (default: "fast")
- `hold_time` (float, optional): Seconds to display final frame (default: 1.5)
- `clear_after` (bool, optional): Clear terminal after animation (default: False)
- `theme` (str, optional): Theme name to use (default: current global theme)
- `custom_text` (str, optional): Custom ASCII art to display
- `custom_file` (str, optional): Path to file containing ASCII art

### `set_theme(theme_name)`

Set the global theme for all banners.

### `list_themes()`

Get list of all available theme names.

### `list_effects()`

Get list of all available effect names.

## Usage Examples

### CLI Tool Integration

```python
#!/usr/bin/env python3
import sys
from hakcer import show_banner, set_theme

def main():
    # Show custom banner at startup
    set_theme("tokyo_night")
    show_banner(
        custom_file="assets/logo.txt",
        effect_name="decrypt",
        hold_time=1.0
    )

    # Your tool logic here
    print("Welcome to My Tool!")

if __name__ == "__main__":
    main()
```

### Smart Terminal Detection

```python
import sys
from hakcer import show_banner

# Only show banner in interactive terminals
if sys.stdout.isatty():
    show_banner(speed_preference="fast")
```

### Different Banners for Different Events

```python
from hakcer import show_banner, set_theme

def show_startup():
    set_theme("tokyo_night")
    show_banner(custom_file="startup.txt", effect_name="decrypt")

def show_error():
    set_theme("dracula")
    show_banner(custom_file="error.txt", effect_name="unstable")

def show_success():
    set_theme("neon")
    show_banner(custom_file="success.txt", effect_name="fireworks")
```

### Production-Ready Setup

```python
import os
import sys
from hakcer import show_banner, set_theme

# Check environment variable
show_banner_enabled = os.getenv("SHOW_BANNER", "true").lower() == "true"
is_interactive = sys.stdout.isatty()

if show_banner_enabled and is_interactive:
    theme = os.getenv("HAKCER_THEME", "synthwave")
    set_theme(theme)
    show_banner(speed_preference="fast", hold_time=0.5)
```

## Creating Custom ASCII Art

### Online Generators

Use these tools to create your ASCII art:
- **[patorjk.com/software/taag](http://patorjk.com/software/taag/)** - Text to ASCII (BEST!)
- **[ascii-generator.site](https://ascii-generator.site/)** - Image to ASCII
- **[ascii.co.uk/art](https://ascii.co.uk/art/)** - ASCII Art Gallery

### Recommended Fonts

For best results with patorjk.com:
- **ANSI Shadow** - Bold, dramatic
- **Big** - Large, simple
- **Cyberlarge** - Perfect for synthwave
- **Graffiti** - Urban style
- **3D-ASCII** - 3D effect

### Tips

1. Keep it reasonably sized (under 100 lines)
2. Use box drawing characters: `╔═══╗`, `║`, `╚═══╝`
3. Test with different effects
4. Consider color themes when designing
5. UTF-8 support - full Unicode character support

## Real-World Use Cases

- **CLI tool splash screens** - Welcome users with style
- **Loading screens** - Make waits more interesting
- **Error/success messages** - Visual feedback
- **Game title screens** - Set the mood
- **Corporate branding** - Professional presence
- **Seasonal greetings** - Holiday themes

## 🔧 Advanced Configuration

### With Click Framework

```python
import click
from hakcer import show_banner, set_theme

@click.command()
@click.option('--no-banner', is_flag=True, help='Disable banner')
@click.option('--theme', default='synthwave', help='Banner theme')
def main(no_banner, theme):
    if not no_banner:
        set_theme(theme)
        show_banner(speed_preference="fast")

    # Your tool logic
    click.echo("Tool is running!")

if __name__ == '__main__':
    main()
```

### With Argparse

```python
import argparse
from hakcer import show_banner, set_theme

parser = argparse.ArgumentParser()
parser.add_argument('--no-banner', action='store_true')
parser.add_argument('--theme', default='synthwave')
args = parser.parse_args()

if not args.no_banner:
    set_theme(args.theme)
    show_banner(speed_preference="fast")
```

## 📦 Package Structure

```
hakcer/
├── __init__.py          # Package exports
├── banner.py            # Main banner logic
└── themes.py            # Theme definitions
```

## Interactive Demo

The package includes a synthwave-themed interactive demo:

```bash
# Run the demo
python showcase.py
```

Features:
- Showcase Mode - All 261 effect combinations
- Theme Gallery - Browse themes
- Custom Effect - Pick combinations
- Effect Browser - Explore by speed
- Synthwave Mode - Ultimate experience

Perfect for recording promotional videos!

## Requirements

- Python 3.8+
- terminaltexteffects >= 0.11.0
- rich >= 13.0.0

## Best Practices

1. **Provide `--no-banner` flag** for automation
2. **Use fast effects** for frequently-run tools
3. **Check TTY** before showing banners
4. **Match themes** to your tool's aesthetic
5. **Keep custom art** reasonably sized

## Links

- **GitHub**: https://github.com/haKC-ai/hakcer
- **PyPI**: https://pypi.org/project/hakcer/
- **Issues**: https://github.com/haKC-ai/hakcer/issues
- **Documentation**: https://github.com/haKC-ai/hakcer#readme

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Credits

Built with:
- **terminaltexteffects** - Amazing terminal effects library
- **rich** - Beautiful terminal formatting

---

**Made by haKCer**

*Transform your CLI tools from boring to legendary!*
