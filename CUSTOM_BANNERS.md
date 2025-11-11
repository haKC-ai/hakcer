# Custom ASCII Art Banners

Use your own ASCII art with haKCer's amazing terminal effects!

## Quick Start

```python
from hakcer import show_banner, set_theme

# Option 1: Use inline custom text
custom_art = """
╔═══════════════════╗
║   MY COOL APP     ║
║   Version 1.0     ║
╚═══════════════════╝
"""
set_theme("cyberpunk")
show_banner(custom_text=custom_art, effect_name="wipe")

# Option 2: Load from file
show_banner(custom_file="my_banner.txt", effect_name="slide")
```

## 📝 Usage

### Method 1: Inline Custom Text

```python
from hakcer import show_banner

my_banner = """
 __  ____   __  ____  ____  ____
(  )(  _ \ / _\(  _ \(  __)(  _ \
 )( ) __//    \) __/ ) _)  )   /
(__)(__)  \_/\_(__) (____)(__\_)
"""

show_banner(
    custom_text=my_banner,
    effect_name="decrypt",
    theme="neon",
    hold_time=2.0
)
```

### Method 2: Load from File

```python
from hakcer import show_banner

show_banner(
    custom_file="custom_banners/logo.txt",
    effect_name="synthgrid",
    theme="tokyo_night"
)
```

## Creating ASCII Art

### ASCII Art Generators

Use these online tools to create your ASCII art:

- **[patorjk.com/software/taag](http://patorjk.com/software/taag/)** - Text to ASCII Art Generator (BEST!)
- **[ascii-generator.site](https://ascii-generator.site/)** - Image to ASCII
- **[ascii.co.uk/art](https://ascii.co.uk/art/)** - ASCII Art Gallery
- **[fsymbols.com/generators](https://fsymbols.com/generators/)** - Text Generators

### Recommended Fonts (from patorjk.com)

For best results, use these fonts:
- **ANSI Shadow** - Bold, dramatic
- **Big** - Large, simple
- **Standard** - Classic look
- **Slant** - Angled style
- **3D-ASCII** - 3D effect
- **Graffiti** - Urban style
- **Cyberlarge** - Perfect for synthwave!

### Tips for Great ASCII Art

1. **Keep it reasonably sized** - Too large = slow rendering
2. **Use box drawing characters** for borders: `╔═══╗`, `║`, `╚═══╝`
3. **Test with different effects** - Some effects work better with certain art styles
4. **Consider color themes** - Your art will be colored by the chosen theme
5. **UTF-8 support** - You can use emoji and special characters! 🚀

## 📁 File Structure

Organize your custom banners:

```
your_project/
├── custom_banners/
│   ├── logo.txt
│   ├── startup.txt
│   ├── error.txt
│   └── success.txt
└── your_script.py
```

## Examples

### Example 1: Simple Text Banner

```python
from hakcer import show_banner, set_theme

banner = """
████████╗ ██████╗  ██████╗ ██╗
╚══██╔══╝██╔═══██╗██╔═══██╗██║
   ██║   ██║   ██║██║   ██║██║
   ██║   ██║   ██║██║   ██║██║
   ██║   ╚██████╔╝╚██████╔╝███████╗
   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
"""

set_theme("matrix")
show_banner(custom_text=banner, effect_name="matrix", hold_time=2.0)
```

### Example 2: CLI Tool Welcome

```python
from hakcer import show_banner

def show_welcome(tool_name: str, version: str):
    banner = f"""
╔═══════════════════════════════════════╗
║                                       ║
║          {tool_name:^29}          ║
║          {f'Version {version}':^29}          ║
║                                       ║
╚═══════════════════════════════════════╝
    """
    show_banner(
        custom_text=banner,
        effect_name="wipe",
        theme="cyberpunk",
        hold_time=1.0
    )

show_welcome("My Awesome Tool", "1.0.0")
```

### Example 3: Dynamic Content

```python
import datetime
from hakcer import show_banner

now = datetime.datetime.now()
greeting_banner = f"""
╔══════════════════════════════════╗
║  Good {now.strftime('%A'):^26}  ║
║  {now.strftime('%B %d, %Y'):^26}  ║
║  {now.strftime('%I:%M %p'):^26}  ║
╚══════════════════════════════════╝
"""

show_banner(custom_text=greeting_banner, effect_name="decrypt")
```

### Example 4: Different Banners for Events

```python
from hakcer import show_banner, set_theme

BANNERS = {
    "startup": "custom_banners/startup.txt",
    "error": "custom_banners/error.txt",
    "success": "custom_banners/success.txt",
}

def show_status(status: str):
    if status == "error":
        set_theme("dracula")
        effect = "unstable"
    elif status == "success":
        set_theme("neon")
        effect = "fireworks"
    else:
        set_theme("tokyo_night")
        effect = "decrypt"

    show_banner(
        custom_file=BANNERS.get(status, BANNERS["startup"]),
        effect_name=effect,
        hold_time=1.0
    )

# Usage
show_status("startup")
# ... do work ...
show_status("success")  # or "error"
```

## Pro Tips

### 1. Match Effects to Art Style

Different effects work better with different art styles:

- **Simple text** → `decrypt`, `slide`, `wipe`, `expand`
- **Box borders** → `wipe`, `pour`, `slide`
- **Complex art** → `synthgrid`, `matrix`, `vhstape`
- **Large banners** → Avoid slow effects like `bouncyballs`, `fireworks`

### 2. Theme Selection

Choose themes that complement your art:

```python
# Tech/cyber themes
set_theme("cyberpunk")   # Bold neon
set_theme("synthwave")   # Retro pink/purple
set_theme("matrix")      # Green terminal

# Professional themes
set_theme("nord")        # Cool blues
set_theme("tokyo_night") # Balanced colors
set_theme("gruvbox")     # Warm earth tones
```

### 3. Performance

For large ASCII art:
```python
# Use faster effects
show_banner(
    custom_file="huge_logo.txt",
    speed_preference="fast",  # Auto-picks fast effects
    hold_time=0.5             # Don't hold too long
)
```

## 🛠️ CLI Integration Example

```python
#!/usr/bin/env python3
import sys
from hakcer import show_banner, set_theme

def main():
    # Show custom banner at startup
    set_theme("synthwave")
    show_banner(
        custom_file="assets/logo.txt",
        effect_name="decrypt",
        hold_time=1.0
    )

    # Your CLI tool logic here
    print("Welcome to My Tool!")
    # ...

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting...")
        sys.exit(0)
```

## 📦 Included Examples

Check the `custom_banners/` directory for examples:

- `hello.txt` - Simple hello world banner
- `neon.txt` - Neon night theme banner
- `rocket.txt` - ASCII art rocket ship

Try them:
```bash
python test_custom_banner.py
```

## ASCII Art Collections

Download pre-made ASCII art:

- **[ASCII Art Archive](https://www.asciiart.eu/)**
- **[ASCII World](https://ascii.co.uk/art)**
- **[Text Art](https://textart.io/)**

## ⚠️ Notes

- Files must be UTF-8 encoded
- Very large ASCII art (>100 lines) may be slow with complex effects
- Line length doesn't matter - haKCer handles any size
- Empty lines are preserved
- Trailing whitespace is kept (useful for alignment)

## Get Creative!

The sky's the limit! Use custom banners for:
- CLI tool splash screens
- Error/success messages
- Loading screens
- Game title screens
- Seasonal greetings
- Corporate logos
- Personal branding

Make your terminal applications **LEGENDARY**! 

---

Made with by haKCer - The Ultimate Terminal Banner Library
