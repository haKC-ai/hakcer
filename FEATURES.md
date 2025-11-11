# haKCer Features Summary

## What's New

### Custom ASCII Art Support (NEW!)

**Use your own ASCII art with all haKCer effects!**

```python
from hakcer import show_banner

# Use your own ASCII art
show_banner(custom_file="my_logo.txt", effect_name="synthgrid")

# Or inline
banner = """
╔═══════════════╗
║  MY COOL APP  ║
╚═══════════════╝
"""
show_banner(custom_text=banner, effect_name="decrypt")
```

**Full Guide**: See [CUSTOM_BANNERS.md](CUSTOM_BANNERS.md)

### Interactive Demo (NEW!)

**Synthwave-themed Rich UI demo for showcasing and recording!**

```bash
python showcase.py
```

Features:
- **Showcase Mode** - Record all 261 effect combinations
- **Theme Gallery** - Browse all 9 themes
- **Custom Effect** - Pick specific combinations
- **Effect Browser** - Interactive selector
- **Synthwave Mode** - Ultimate experience

**Full Guide**: See [EXAMPLE_README.md](EXAMPLE_README.md)

## Core Features

### Themes (9 Available)

```python
from hakcer import set_theme, list_themes

# Available themes
print(list_themes())
# ['cyberpunk', 'dracula', 'gruvbox', 'matrix', 'neon',
#  'nord', 'synthwave', 'tokyo_night', 'tokyo_night_storm']

set_theme("cyberpunk")
```

### Effects (29 Available)

**Fast Effects (10)**: decrypt, expand, print, slide, wipe, colorshift, scattered, random_sequence, pour, errorcorrect

**Medium Effects (10)**: beams, binarypath, burn, crumble, overflow, rain, spray, unstable, vhstape, waves

**Slow Effects (9)**: blackhole, bouncyballs, fireworks, matrix, orbittingvolley, rings, spotlights, swarm, synthgrid

```python
from hakcer import show_banner

# Random fast effect
show_banner(speed_preference="fast")

# Specific effect
show_banner(effect_name="synthgrid")

# List all effects
from hakcer import list_effects
print(list_effects())
```

### 🎛️ Customization Options

```python
from hakcer import show_banner, set_theme

show_banner(
    effect_name="synthgrid",     # Which effect
    speed_preference="fast",      # Or auto-pick by speed
    hold_time=2.0,                # How long to hold final frame
    clear_after=True,             # Clear screen after
    theme="cyberpunk",            # Which color theme
    custom_text="...",            # Your ASCII art (inline)
    custom_file="logo.txt"        # Your ASCII art (from file)
)
```

## 📚 Documentation

- **[CUSTOM_BANNERS.md](CUSTOM_BANNERS.md)** - Complete guide to custom ASCII art
- **[EXAMPLE_README.md](EXAMPLE_README.md)** - Interactive demo usage
- **[examples.py](examples.py)** - Original 10 usage examples
- **[test_custom_banner.py](test_custom_banner.py)** - Test custom banners

## Quick Examples

### Basic Usage
```python
from hakcer import show_banner
show_banner()  # That's it!
```

### With Theme
```python
from hakcer import show_banner, set_theme

set_theme("tokyo_night")
show_banner()
```

### Custom Banner
```python
show_banner(custom_file="my_logo.txt", theme="neon")
```

### CLI Tool Integration
```python
def main():
    show_banner(
        custom_file="assets/logo.txt",
        effect_name="decrypt",
        theme="cyberpunk",
        hold_time=1.0
    )
    # Your tool logic here
```

### Fast Startup
```python
# For quick CLI tools
show_banner(speed_preference="fast", hold_time=0.5)
```

## Interactive Demo

Run the synthwave-themed demo:

```bash
python showcase.py
```

Features:
1. **Showcase All Effects** - Perfect for recording videos
2. **Theme Gallery** - Browse all themes
3. **Quick Demo** - Fast preview
4. **Custom Effect** - Choose your combo
5. **Effect Browser** - Explore effects by speed
6. **Speed Test** - Compare speeds
7. **Info** - List everything
8. **Synthwave Mode** - Ultimate experience

## Advanced Features

### Environment Variables
```bash
export HAKCER_THEME=cyberpunk
export SHOW_BANNER=true
```

### Terminal Detection
```python
import sys
from hakcer import show_banner

if sys.stdout.isatty():
    show_banner()  # Only in interactive terminals
```

### Error Handling
```python
from hakcer import show_banner, set_theme

try:
    set_theme("invalid")
except ValueError:
    set_theme("synthwave")  # Fallback
```

## 📦 Installation

```bash
pip install hakcer
```

## Create Custom Art

Use [patorjk.com/software/taag](http://patorjk.com/software/taag/) to generate ASCII art, then:

```python
# Save to file
show_banner(custom_file="my_art.txt")

# Or use inline
my_art = """
YOUR ASCII ART HERE
"""
show_banner(custom_text=my_art)
```

## Pro Tips

1. **Fast startup**: Use `speed_preference="fast"` and `hold_time=0.5`
2. **Video recording**: Use showcase mode in `showcase.py`
3. **Custom branding**: Create your own ASCII art file
4. **Theme matching**: Choose themes that complement your art
5. **Production ready**: Combine with terminal detection and env vars

## Use Cases

- CLI tool splash screens
- Welcome messages
- Loading screens
- Error/success notifications
- Game title screens
- Corporate branding
- Seasonal greetings
- Personal projects

## Resources

- **PyPI**: https://pypi.org/project/hakcer/
- **GitHub**: https://github.com/haKC-ai/hakcer
- **ASCII Art Generator**: http://patorjk.com/software/taag/
- **Rich Library**: https://rich.readthedocs.io/

---

Made with by haKCer - The Ultimate Terminal Banner Library
