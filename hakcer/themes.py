"""
Theme configurations for haKCer banner effects.

Each theme defines color palettes that are applied to the terminal effects.
"""

THEMES = {
    "synthwave": {
        "name": "Synthwave",
        "description": "Classic synthwave with cyan, magenta, purple (default)",
        "colors": {
            "primary": ["00D9FF", "FF10F0", "7928CA"],
            "accent": ["FF0080", "00F0FF"],
            "error": ["FF006E"],
            "gradient_stops": ["00D9FF", "FF10F0", "7928CA"],
            "beam_colors": ["00D9FF", "FF0080"],
        }
    },
    "tokyo_night": {
        "name": "Tokyo Night",
        "description": "Dark blue aesthetic with purple and teal accents",
        "colors": {
            "primary": ["7aa2f7", "bb9af7", "7dcfff"],  # Blue, purple, cyan
            "accent": ["f7768e", "9ece6a"],  # Red, green
            "error": ["f7768e"],
            "gradient_stops": ["7aa2f7", "bb9af7", "2ac3de"],
            "beam_colors": ["7dcfff", "bb9af7"],
        }
    },
    "tokyo_night_storm": {
        "name": "Tokyo Night Storm",
        "description": "Deeper blue Tokyo Night variant with stronger contrast",
        "colors": {
            "primary": ["82aaff", "c792ea", "89ddff"],  # Brighter blue, purple, cyan
            "accent": ["ff757f", "c3e88d"],  # Coral, lime
            "error": ["ff5370"],
            "gradient_stops": ["82aaff", "c792ea", "89ddff"],
            "beam_colors": ["89ddff", "c792ea"],
        }
    },
    "neon": {
        "name": "Neon",
        "description": "Bright electric neon colors - pink, green, blue",
        "colors": {
            "primary": ["00ff00", "ff00ff", "00ffff"],  # Bright green, magenta, cyan
            "accent": ["ffff00", "ff0080"],  # Yellow, hot pink
            "error": ["ff0000"],
            "gradient_stops": ["00ff00", "ff00ff", "00ffff"],
            "beam_colors": ["00ffff", "ff00ff"],
        }
    },
    "cyberpunk": {
        "name": "Cyberpunk",
        "description": "Yellow and pink cyberpunk 2077 inspired colors",
        "colors": {
            "primary": ["fcee09", "ff2a6d", "05d9e8"],  # Yellow, hot pink, cyan
            "accent": ["d1f7ff", "ff6c11"],  # Light blue, orange
            "error": ["ff013c"],
            "gradient_stops": ["fcee09", "ff2a6d", "05d9e8"],
            "beam_colors": ["fcee09", "ff2a6d"],
        }
    },
    "matrix": {
        "name": "Matrix",
        "description": "Classic green matrix theme",
        "colors": {
            "primary": ["00ff41", "008f11", "003b00"],  # Bright to dark green
            "accent": ["00ff41", "00d936"],
            "error": ["00ff41"],
            "gradient_stops": ["00ff41", "008f11", "003b00"],
            "beam_colors": ["00ff41", "008f11"],
        }
    },
    "dracula": {
        "name": "Dracula",
        "description": "Popular Dracula theme - purple, pink, cyan",
        "colors": {
            "primary": ["bd93f9", "ff79c6", "8be9fd"],  # Purple, pink, cyan
            "accent": ["50fa7b", "ffb86c"],  # Green, orange
            "error": ["ff5555"],
            "gradient_stops": ["bd93f9", "ff79c6", "8be9fd"],
            "beam_colors": ["8be9fd", "ff79c6"],
        }
    },
    "nord": {
        "name": "Nord",
        "description": "Arctic, north-bluish color palette",
        "colors": {
            "primary": ["88c0d0", "81a1c1", "5e81ac"],  # Frost blues
            "accent": ["b48ead", "a3be8c"],  # Purple, green
            "error": ["bf616a"],
            "gradient_stops": ["88c0d0", "81a1c1", "b48ead"],
            "beam_colors": ["88c0d0", "5e81ac"],
        }
    },
    "gruvbox": {
        "name": "Gruvbox",
        "description": "Retro groove warm colors",
        "colors": {
            "primary": ["fe8019", "d3869b", "83a598"],  # Orange, purple, blue
            "accent": ["b8bb26", "fabd2f"],  # Green, yellow
            "error": ["fb4934"],
            "gradient_stops": ["fe8019", "d3869b", "83a598"],
            "beam_colors": ["fabd2f", "fe8019"],
        }
    },
}

# Default theme
_current_theme = "neon"


def get_theme(theme_name: str = None) -> dict:
    """
    Get theme configuration by name.

    Args:
        theme_name: Name of the theme. If None, returns current theme.

    Returns:
        Theme configuration dictionary.

    Raises:
        ValueError: If theme_name is not recognized.
    """
    if theme_name is None:
        theme_name = _current_theme

    if theme_name not in THEMES:
        available = ", ".join(sorted(THEMES.keys()))
        raise ValueError(f"Unknown theme: {theme_name}. Available: {available}")

    return THEMES[theme_name]


def set_current_theme(theme_name: str) -> None:
    """
    Set the current global theme.

    Args:
        theme_name: Name of the theme to set as current.

    Raises:
        ValueError: If theme_name is not recognized.
    """
    global _current_theme
    if theme_name not in THEMES:
        available = ", ".join(sorted(THEMES.keys()))
        raise ValueError(f"Unknown theme: {theme_name}. Available: {available}")
    _current_theme = theme_name


def get_current_theme_name() -> str:
    """Get the name of the current global theme."""
    return _current_theme


def list_available_themes() -> list[str]:
    """Get a list of all available theme names."""
    return sorted(THEMES.keys())
