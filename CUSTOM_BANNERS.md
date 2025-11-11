```
╔══════════════════════════════════════════════════════════════╗
║              Custom ASCII Art Banners Guide                  ║
╚══════════════════════════════════════════════════════════════╝

  Feature...........................Custom ASCII Art Support
  Format.................................TXT / Inline String
  Support...............................UTF-8 / Box Drawing
  Effects........................................All 29x
  Status...............................[BRING YOUR OWN ART]
```

## [QUICK START]

```python
from hakcer import show_banner, set_theme

# Option 1: Use inline custom text
custom_art = """
╔═══════════════════╗
║   MY COOL APP     ║
╚═══════════════════╝
"""
show_banner(custom_text=custom_art, theme="neon")

# Option 2: Load from file
show_banner(custom_file="my_logo.txt", theme="cyberpunk")
```

## [BASIC USAGE]

### From File

```python
from hakcer import show_banner

# Load your ASCII art
show_banner(
    custom_file="assets/logo.txt",
    effect_name="decrypt",
    theme="neon"
)
```

### Inline

```python
banner = """
 ███╗   ███╗██╗   ██╗
 ████╗ ████║╚██╗ ██╔╝
 ██╔████╔██║ ╚████╔╝
 ██║╚██╔╝██║  ╚██╔╝
 ██║ ╚═╝ ██║   ██║
 ╚═╝     ╚═╝   ╚═╝
"""

show_banner(
    custom_text=banner,
    effect_name="synthgrid",
    theme="tokyo_night"
)
```

### With All Options

```python
from hakcer import show_banner

show_banner(
    custom_file="custom_banners/logo.txt",
    effect_name="synthgrid",
    theme="tokyo_night"
)
```

## [CREATING ASCII ART]

### ASCII Art Generators

Use these online tools to create your ASCII art:

- **http://patorjk.com/software/taag/** - Text to ASCII Art Generator (BEST!)
- **https://ascii-generator.site/** - Image to ASCII
- **https://ascii.co.uk/art/** - ASCII Art Gallery

### Recommended Fonts

```
ANSI Shadow - Bold block letters
Bloody - Dripping horror style
Doom - Classic Doom font
Graffiti - Street art style
3D-ASCII - 3D effect
ANSI Regular - Clean terminal style
Block - Solid blocks
Banner3 - Large banner text
```

### Tips for Good ASCII Art

```
[1] Keep it under 100 lines
[2] Use box drawing: ╔═══╗, ║, ╚═══╝
[3] Test with different effects
[4] Consider color themes
[5] UTF-8 support - full Unicode
```

## [FILE STRUCTURE]

```
your_project/
├── assets/
│   ├── logo.txt
│   ├── startup.txt
│   └── error.txt
└── your_script.py
```

## [EXAMPLES]

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
show_banner(custom_text=banner, effect_name="decrypt")
```

### Example 2: Box Border Design

```python
banner = """
┏━━━━━━━━━━━━━━━━━━━━━┓
┃                     ┃
┃    SUPER APP v2.0   ┃
┃                     ┃
┗━━━━━━━━━━━━━━━━━━━━━┛
"""

show_banner(custom_text=banner, effect_name="wipe")
```

### Example 3: Multi-State Banners

```python
from hakcer import show_banner, set_theme

BANNERS = {
    "startup": "assets/startup.txt",
    "success": "assets/success.txt",
    "error": "assets/error.txt"
}

def show_status(status):
    set_theme("neon" if status == "success" else "cyberpunk")
    show_banner(
        custom_file=BANNERS[status],
        effect_name="decrypt",
        hold_time=1.0
    )

# Usage
show_status("startup")
# ... do work ...
show_status("success")  # or "error"
```

## [PRO TIPS]

### Match Effects to Art Style

Different effects work better with different art styles:

```
[*] Simple text → decrypt, slide, wipe, expand
[*] Box borders → wipe, pour, slide
[*] Complex art → synthgrid, matrix, vhstape
[*] Large banners → fireworks, blackhole, swarm
```

### Theme Selection

Choose themes that complement your art:

```
[*] Corporate/Professional → nord, tokyo_night
[*] Retro/Gaming → synthwave, cyberpunk
[*] Terminal/Hacker → matrix, neon
[*] Dark mode apps → dracula, gruvbox
```

### Performance

```
[*] Keep art under 100 lines
[*] Use fast effects for production
[*] Test on target terminals
[*] Consider terminal width
```

## [INCLUDED EXAMPLES]

Check the custom_banners/ directory:

```
custom_banners/
├── SecKC.txt - SecKC banner
├── curious_max.txt - Curious Max design
```

Try them:
```bash
python test_custom_banner.py
```

## [ASCII ART COLLECTIONS]

Download pre-made ASCII art:

- **https://www.asciiart.eu/** - Huge collection
- **https://ascii.co.uk/art** - Categorized art
- **https://textart.io/** - Text art generator

## [NOTES]

```
[*] Files must be UTF-8 encoded
[*] Very large art (>100 lines) may be slow with complex effects
[*] Line length doesn't matter - haKCer handles any size
[*] Empty lines are preserved
[*] Trailing whitespace is kept (useful for alignment)
```

## [USE CASES]

```
[*] CLI tool splash screens
[*] Error/success messages
[*] Loading screens
[*] Game title screens
[*] Seasonal greetings
[*] Corporate logos
[*] Personal branding
```

Make your terminal applications LEGENDARY!

```
─────────────────────────────────────────────────────────
   Made by haKCer - The Ultimate Terminal Banner Library
─────────────────────────────────────────────────────────
```
