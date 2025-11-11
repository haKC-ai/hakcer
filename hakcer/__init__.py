"""
haKCer - Animated ASCII Banner with Terminal Effects and Themes

A pip-installable module for adding eye-catching animated banners to any Python CLI tool.
Features 23+ different effects with customizable themes including Tokyo Night, Neon, and Cyberpunk.
"""

from .banner import show_banner, list_effects, get_effects_by_speed, set_theme, list_themes, get_current_theme
from .themes import THEMES

__version__ = "1.1.4"
__author__ = "haKCer"
__all__ = [
    "show_banner",
    "list_effects",
    "get_effects_by_speed",
    "set_theme",
    "list_themes",
    "get_current_theme",
    "THEMES",
]
