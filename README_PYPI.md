# haKCer - Animated ASCII Banner with Themes 🚀

**Drop-in animated ASCII banners for your Python CLI tools with customizable themes**

[![PyPI version](https://badge.fury.io/py/hakcer.svg)](https://badge.fury.io/py/hakcer)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **23+ Terminal Effects** - From subtle to spectacular animations
- 🌈 **9 Beautiful Themes** - Tokyo Night, Cyberpunk, Neon, Dracula, and more
- ⚡ **Speed Categories** - Fast (<2s), Medium (2-4s), Slow (4s+)
- 🔧 **Zero Config** - Works out of the box with sensible defaults
- 📦 **Pip Installable** - Easy installation and integration
- 🎯 **Simple API** - Just 2 lines of code to get started

## 🚀 Quick Start

### Installation

```bash
pip install hakcer
```

### Basic Usage

```python
from hakcer import show_banner

# Show banner with default theme (synthwave) and random fast effect
show_banner()

# Your application code here
print("Welcome to my CLI tool!")
```

That's it! You now have an animated banner in your CLI application.

## 🎨 Themes

Choose from 9 stunning themes:

### Available Themes

| Theme | Description | Preview Colors |
|-------|-------------|----------------|
| **synthwave** | Classic synthwave with cyan, magenta, purple (default) | 🔵 🟣 🔴 |
| **tokyo_night** | Dark blue aesthetic inspired by Tokyo at night | 🔵 🟣 🔵 |
| **tokyo_night_storm** | Deeper blue Tokyo Night variant with stronger contrast | 🔵 🟣 🔵 |
| **neon** | Bright electric neon colors - perfect for cyberpunk vibes | 🟢 🟣 🔵 |
| **cyberpunk** | Yellow and pink Cyberpunk 2077 inspired | 🟡 🔴 🔵 |
| **matrix** | Classic green matrix theme | 🟢 🟢 🟢 |
| **dracula** | Popular Dracula theme with purple and pink | 🟣 🔴 🔵 |
| **nord** | Arctic north-bluish color palette | 🔵 🔵 🟣 |
| **gruvbox** | Retro groove with warm colors | 🟠 🟣 🔵 |

### Using Themes

```python
from hakcer import show_banner, set_theme

# Set theme globally
set_theme("tokyo_night")
show_banner()

# Or use theme for a single banner
show_banner(theme="cyberpunk")

# List all available themes
from hakcer import list_themes
print(list_themes())
```

## 🎭 Effects

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

### Available Effects

**Fast Effects**: `decrypt`, `expand`, `print`, `slide`, `wipe`, `colorshift`, `scattered`, `randomsequence`, `pour`, `errorcorrect`

**Medium Effects**: `beams`, `binarypath`, `burn`, `crumble`, `overflow`, `rain`, `spray`, `unstable`, `vhstape`, `waves`

**Slow Effects**: `blackhole`, `bouncyballs`, `fireworks`, `matrix`, `orbittingvolley`, `rings`, `spotlights`, `swarm`, `synthgrid`

## 📖 Usage Examples

### Example 1: Simple CLI Tool

```python
from hakcer import show_banner, set_theme

def main():
    set_theme("neon")
    show_banner(speed_preference="fast")
    print("🎯 My Awesome CLI Tool v1.0")
    # Your tool logic here

if __name__ == "__main__":
    main()
```

### Example 2: With Click Integration

```python
import click
from hakcer import show_banner, set_theme

@click.command()
@click.option('--no-banner', is_flag=True, help='Skip banner animation')
@click.option('--theme', default='tokyo_night', help='Banner theme')
def cli(no_banner, theme):
    if not no_banner:
        set_theme(theme)
        show_banner()

    click.echo("Running application...")

if __name__ == "__main__":
    cli()
```

### Example 3: Theme Switching

```python
from hakcer import show_banner, set_theme, list_themes

# Show all themes
for theme in list_themes():
    print(f"\n🎨 Theme: {theme}")
    set_theme(theme)
    show_banner(effect_name="slide", hold_time=1.0)
```

### Example 4: Conditional Display

```python
import sys
from hakcer import show_banner, set_theme

def main():
    # Only show banner in interactive terminals
    if sys.stdout.isatty():
        set_theme("cyberpunk")
        show_banner(speed_preference="fast")

    # Your application logic
    print("Application started...")

if __name__ == "__main__":
    main()
```

## 🎯 API Reference

### `show_banner()`

Display the haKCer banner with animation.

**Parameters:**
- `effect_name` (str, optional): Specific effect to use
- `speed_preference` (str, optional): "fast", "medium", "slow", or "any" (default: "fast")
- `hold_time` (float, optional): Seconds to display final frame (default: 1.5)
- `clear_after` (bool, optional): Clear terminal after animation (default: False)
- `theme` (str, optional): Theme name to use (default: current global theme)

### `set_theme(theme_name)`

Set the global theme for all banners.

**Parameters:**
- `theme_name` (str): Name of theme to use

### `list_themes()`

Get list of all available theme names.

**Returns:** List of theme name strings

### `list_effects()`

Get list of all available effect names.

**Returns:** List of effect name strings

### `get_effects_by_speed(speed)`

Get effects filtered by speed category.

**Parameters:**
- `speed` (str): "fast", "medium", or "slow"

**Returns:** List of effect names in that category

## 🛠️ Advanced Configuration

### Custom Hold Time

```python
# Display for 3 seconds before continuing
show_banner(hold_time=3.0)

# No hold time
show_banner(hold_time=0)
```

### Clear Terminal After

```python
# Clear terminal after animation
show_banner(clear_after=True)
```

### Environment Variable Control

```python
import os
from hakcer import show_banner

# Check environment variable
if os.getenv("SHOW_BANNER", "true").lower() != "false":
    show_banner()
```

## 💡 Best Practices

1. **Always provide `--no-banner` flag** for automation/scripting
2. **Use fast effects** in production tools that run frequently
3. **Check TTY** before showing banner to avoid piping issues
4. **Pick themes** that match your tool's aesthetic

```python
import sys
from hakcer import show_banner

if sys.stdout.isatty():
    show_banner(speed_preference="fast")
```

## 📋 Requirements

- Python 3.8+
- terminaltexteffects >= 0.11.0
- rich >= 13.0.0

## 🐛 Troubleshooting

**Banner not showing?**
- Terminal needs to be at least 80 columns wide
- Check that you're in an interactive terminal (TTY)
- Verify terminaltexteffects is installed: `pip install terminaltexteffects`

**Animation too slow?**
- Use `speed_preference="fast"` for quicker effects
- Reduce `hold_time` parameter
- Choose specific fast effects like `decrypt` or `slide`

**Import errors?**
- Ensure package is installed: `pip install hakcer`
- Check Python version: `python --version` (needs 3.8+)

## 🤝 Contributing

Contributions welcome! Areas for contribution:
- New themes
- Additional effects
- Performance improvements
- Documentation

## 📝 License

MIT License - see LICENSE file for details

## 🎨 Theme Showcase

Try different themes with:

```bash
python3 -c "from hakcer import *; [show_banner(theme=t, effect_name='slide') for t in list_themes()]"
```

## 🔗 Links

- **PyPI**: https://pypi.org/project/hakcer/
- **GitHub**: https://github.com/haKC-ai/hakcer
- **Issues**: https://github.com/haKC-ai/hakcer/issues

---

**Made with ⚡ by haKCer | The Pinnacle of Hakcing Quality**

Add instant style to your CLI tools! 🚀
