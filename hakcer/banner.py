"""
haKCer ASCII Banner with Randomized Terminal Text Effects

A reusable splash screen module that displays the haKCer logo with
randomly selected terminal effects from terminaltexteffects library.

Usage:
    from hakcer import show_banner, set_theme

    set_theme("tokyo_night")  # Optional: set theme
    show_banner()  # Random effect
    show_banner(effect_name="decrypt")  # Specific effect
    show_banner(hold_time=3.0)  # Hold for 3 seconds after animation
"""

import random
import time
import shutil
from typing import Optional

from terminaltexteffects.effects import (
    effect_beams,
    effect_binarypath,
    effect_blackhole,
    effect_bouncyballs,
    effect_burn,
    effect_colorshift,
    effect_crumble,
    effect_decrypt,
    effect_errorcorrect,
    effect_expand,
    effect_fireworks,
    effect_matrix,
    effect_orbittingvolley,
    effect_overflow,
    effect_pour,
    effect_print,
    effect_rain,
    effect_random_sequence,
    effect_rings,
    effect_scattered,
    effect_slide,
    effect_spotlights,
    effect_spray,
    effect_swarm,
    effect_synthgrid,
    effect_unstable,
    effect_vhstape,
    effect_waves,
    effect_wipe,
)
from terminaltexteffects.utils.graphics import Color

from .themes import get_theme, set_current_theme, get_current_theme_name, list_available_themes

HAKCER_ASCII = """

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
  .:/====================█▓██▓██=========████▓█▓█ ███======> [ P R E S E N T S ] ====\\:.
        /\\                 ██▓██           █▓▓▓██ ██
 _ __  /  \\__________________█▓█_____________██▓██______________________________ _  _    _
_ __ \\/ /\\____________________██_____________ ███________ _________ __ _______ _
    \\  /         T H E   P I N A C L E    O F   H A K C I N G   Q U A L I T Y
     \\/
"""


def _is_hex_color(s: str) -> bool:
    """Check if string is a valid hex color code."""
    return bool(len(s) == 6 and all(c in '0123456789abcdefABCDEF' for c in s))


def _convert_value(val: str):
    """Convert string value to appropriate type."""
    # Try hex color first
    if _is_hex_color(val):
        return Color(val)
    # Try integer
    try:
        return int(val)
    except ValueError:
        pass
    # Try float
    try:
        return float(val)
    except ValueError:
        pass
    # Return as string
    return val


def _parse_args_to_kwargs(args: list[str]) -> dict:
    """Convert command-line style args list to kwargs dict."""
    kwargs = {}
    i = 0
    while i < len(args):
        if args[i].startswith("--"):
            key = args[i][2:].replace("-", "_")
            # Check if next item is a value or another flag
            if i + 1 < len(args) and not args[i + 1].startswith("--"):
                # Collect all values until next flag
                values = []
                i += 1
                while i < len(args) and not args[i].startswith("--"):
                    values.append(_convert_value(args[i]))
                    i += 1
                # Store as single value or list
                kwargs[key] = values if len(values) > 1 else values[0]
            else:
                kwargs[key] = True
                i += 1
        else:
            i += 1
    return kwargs


def _get_effect_config(effect_name: str, theme: dict) -> dict:
    """Generate effect configuration with theme colors."""
    colors = theme["colors"]

    configs = {
        "beams": {
            "module": effect_beams,
            "class_name": "Beams",
            "args": [
                "--beam-row-symbols", "▂ ▁ _ ⎽",
                "--beam-column-symbols", "▌ ▍ ▎ ▏",
                "--final-gradient-stops"] + colors["primary"] + [
                "--beam-gradient-stops"] + colors["beam_colors"],
        },
        "binarypath": {
            "module": effect_binarypath,
            "class_name": "BinaryPath",
            "args": [
                "--final-gradient-stops"] + colors["primary"] + [
                "--binary-colors"] + colors["accent"],
        },
        "blackhole": {
            "module": effect_blackhole,
            "class_name": "Blackhole",
            "args": ["--star-colors"] + colors["primary"] + colors["accent"],
        },
        "bouncyballs": {
            "module": effect_bouncyballs,
            "class_name": "BouncyBalls",
            "args": ["--ball-colors"] + colors["primary"] + colors["accent"],
        },
        "burn": {
            "module": effect_burn,
            "class_name": "Burn",
            "args": [
                "--starting-color", colors["accent"][0],
                "--burn-colors"] + colors["accent"] + [colors["primary"][2]],
        },
        "colorshift": {
            "module": effect_colorshift,
            "class_name": "ColorShift",
            "args": [
                "--gradient-stops"] + colors["gradient_stops"] + [colors["accent"][0]],
        },
        "crumble": {
            "module": effect_crumble,
            "class_name": "Crumble",
            "args": ["--final-gradient-stops"] + colors["primary"],
        },
        "decrypt": {
            "module": effect_decrypt,
            "class_name": "Decrypt",
            "args": [
                "--typing-speed", "2",
                "--ciphertext-colors"] + colors["accent"] + [
                "--final-gradient-stops"] + colors["gradient_stops"],
        },
        "errorcorrect": {
            "module": effect_errorcorrect,
            "class_name": "ErrorCorrect",
            "args": [
                "--error-pairs", "20",
                "--error-color", colors["error"][0],
                "--correct-color", colors["primary"][0]],
        },
        "expand": {
            "module": effect_expand,
            "class_name": "Expand",
            "args": [
                "--final-gradient-stops"] + colors["primary"] + [
                "--movement-speed", "0.5"],
        },
        "fireworks": {
            "module": effect_fireworks,
            "class_name": "Fireworks",
            "args": [
                "--firework-colors"] + colors["primary"] + colors["accent"] + [
                "--firework-symbol", "●"],
        },
        "matrix": {
            "module": effect_matrix,
            "class_name": "Matrix",
            "args": [
                "--final-gradient-stops"] + colors["primary"][:2],
        },
        "orbittingvolley": {
            "module": effect_orbittingvolley,
            "class_name": "OrbittingVolley",
            "args": [
                "--top-launcher-symbol", "▲",
                "--right-launcher-symbol", "▶",
                "--bottom-launcher-symbol", "▼",
                "--left-launcher-symbol", "◀",
                "--volley-colors"] + colors["primary"],
        },
        "overflow": {
            "module": effect_overflow,
            "class_name": "Overflow",
            "args": [
                "--overflow-gradient-stops"] + colors["accent"] + [
                "--final-gradient-stops", colors["primary"][0], colors["primary"][2]],
        },
        "pour": {
            "module": effect_pour,
            "class_name": "Pour",
            "args": [
                "--pour-direction", "down",
                "--pour-speed", "2",
                "--gap", "1",
                "--final-gradient-stops"] + colors["primary"],
        },
        "print": {
            "module": effect_print,
            "class_name": "Print",
            "args": [
                "--final-gradient-stops"] + colors["primary"] + [
                "--print-head-return-speed", "1.5"],
        },
        "rain": {
            "module": effect_rain,
            "class_name": "Rain",
            "args": ["--rain-colors"] + colors["primary"] + [colors["accent"][0]],
        },
        "random_sequence": {
            "module": effect_random_sequence,
            "class_name": "RandomSequence",
            "args": [
                "--starting-color", colors["primary"][1],
                "--final-gradient-stops", colors["primary"][0], colors["primary"][2]],
        },
        "rings": {
            "module": effect_rings,
            "class_name": "Rings",
            "args": ["--ring-colors"] + colors["primary"] + [colors["accent"][0]],
        },
        "scattered": {
            "module": effect_scattered,
            "class_name": "Scattered",
            "args": [
                "--final-gradient-stops"] + colors["primary"] + [
                "--movement-speed", "0.5"],
        },
        "slide": {
            "module": effect_slide,
            "class_name": "Slide",
            "args": [
                "--final-gradient-stops"] + colors["primary"],
        },
        "spotlights": {
            "module": effect_spotlights,
            "class_name": "Spotlights",
            "args": [
                "--beam-width-ratio", "2.0",
                "--search-duration", "750",
                "--final-gradient-stops"] + colors["primary"][:2],
        },
        "spray": {
            "module": effect_spray,
            "class_name": "Spray",
            "args": [
                "--final-gradient-stops"] + colors["primary"][:2],
        },
        "swarm": {
            "module": effect_swarm,
            "class_name": "Swarm",
            "args": [
                "--swarm-colors"] + colors["primary"] + [colors["accent"][0]] + [
                "--final-gradient-stops", colors["primary"][0], colors["primary"][2]],
        },
        "synthgrid": {
            "module": effect_synthgrid,
            "class_name": "SynthGrid",
            "args": [
                "--grid-gradient-stops", colors["primary"][1], colors["primary"][0],
                "--text-gradient-stops"] + colors["gradient_stops"],
        },
        "unstable": {
            "module": effect_unstable,
            "class_name": "Unstable",
            "args": [
                "--unstable-color", colors["error"][0],
                "--final-gradient-stops"] + colors["primary"],
        },
        "vhstape": {
            "module": effect_vhstape,
            "class_name": "VHSTape",
            "args": [
                "--final-gradient-stops"] + colors["primary"] + [
                "--glitch-line-colors"] + colors["accent"],
        },
        "waves": {
            "module": effect_waves,
            "class_name": "Waves",
            "args": [
                "--wave-symbols", "▁ ▂ ▃ ▄ ▅ ▆ ▇ █ ▇ ▆ ▅ ▄ ▃ ▂ ▁",
                "--wave-gradient-stops"] + colors["primary"] + [
                "--final-gradient-stops", colors["primary"][0], colors["primary"][2]],
        },
        "wipe": {
            "module": effect_wipe,
            "class_name": "Wipe",
            "args": [
                "--wipe-direction", "diagonal_top_left_to_bottom_right",
                "--final-gradient-stops"] + colors["primary"],
        },
    }

    return configs.get(effect_name)


FAST_EFFECTS = [
    "decrypt", "expand", "print", "slide", "wipe", "colorshift",
    "scattered", "random_sequence", "pour", "errorcorrect"
]

MEDIUM_EFFECTS = [
    "beams", "binarypath", "burn", "crumble", "overflow",
    "rain", "spray", "unstable", "vhstape", "waves"
]

SLOW_EFFECTS = [
    "blackhole", "bouncyballs", "fireworks", "matrix",
    "orbittingvolley", "rings", "spotlights", "swarm", "synthgrid"
]

ALL_EFFECTS = FAST_EFFECTS + MEDIUM_EFFECTS + SLOW_EFFECTS


def _center_text(text: str) -> str:
    """Center text based on terminal width."""
    terminal_width = shutil.get_terminal_size().columns
    lines = text.split('\n')

    # Find the maximum line length
    max_line_length = max(len(line) for line in lines) if lines else 0

    # Calculate padding needed
    padding = max(0, (terminal_width - max_line_length) // 2)

    # Add padding to each line
    centered_lines = [' ' * padding + line for line in lines]

    return '\n'.join(centered_lines)


def show_banner(
    effect_name: Optional[str] = None,
    speed_preference: str = "fast",
    hold_time: float = 1.5,
    clear_after: bool = False,
    theme: Optional[str] = None,
    custom_text: Optional[str] = None,
    custom_file: Optional[str] = None,
) -> None:
    """
    Display the haKCer ASCII banner with a randomized terminal effect.

    Args:
        effect_name: Specific effect to use. If None, randomly selects based on speed_preference.
        speed_preference: Speed category for random selection ("fast", "medium", "slow", "any").
        hold_time: Seconds to hold the final frame before returning.
        clear_after: Whether to clear the terminal after the effect completes.
        theme: Theme name to use. If None, uses current global theme.
        custom_text: Custom ASCII art text to display instead of default banner.
        custom_file: Path to file containing custom ASCII art. Overrides custom_text.

    Raises:
        ValueError: If effect_name or theme is not recognized.
        FileNotFoundError: If custom_file is specified but not found.
    """
    # Determine which ASCII art to use
    if custom_file:
        try:
            with open(custom_file, 'r', encoding='utf-8') as f:
                ascii_art = f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Custom ASCII art file not found: {custom_file}")
    elif custom_text:
        ascii_art = custom_text
    else:
        ascii_art = HAKCER_ASCII

    # Center the ASCII art based on terminal width
    ascii_art = _center_text(ascii_art)

    # Get theme configuration
    theme_config = get_theme(theme)

    # Select effect
    if effect_name:
        if effect_name not in ALL_EFFECTS:
            available = ", ".join(sorted(ALL_EFFECTS))
            raise ValueError(
                f"Unknown effect: {effect_name}. Available: {available}"
            )
        selected_effect = effect_name
    else:
        if speed_preference == "fast":
            selected_effect = random.choice(FAST_EFFECTS)
        elif speed_preference == "medium":
            selected_effect = random.choice(MEDIUM_EFFECTS)
        elif speed_preference == "slow":
            selected_effect = random.choice(SLOW_EFFECTS)
        else:
            selected_effect = random.choice(ALL_EFFECTS)

    # Get effect configuration with theme colors
    config = _get_effect_config(selected_effect, theme_config)
    if not config:
        raise ValueError(f"Effect {selected_effect} not properly configured")

    # Get the effect class and config class
    effect_class, config_class = config["module"].get_effect_and_args()

    # Parse args to kwargs and create config
    kwargs = _parse_args_to_kwargs(config["args"])
    effect_config = config_class(**kwargs)

    # Create effect instance with custom or default ASCII art and set config
    effect = effect_class(ascii_art)
    effect.effect_config = effect_config

    with effect.terminal_output() as terminal:
        for frame in effect:
            terminal.print(frame)

    if hold_time > 0:
        time.sleep(hold_time)

    if clear_after:
        print("\033[2J\033[H", end="", flush=True)


def list_effects() -> list[str]:
    """
    Get a list of all available effect names.

    Returns:
        Sorted list of effect names.
    """
    return sorted(ALL_EFFECTS)


def get_effects_by_speed(speed: str) -> list[str]:
    """
    Get effects filtered by speed category.

    Args:
        speed: Speed category ("fast", "medium", "slow").

    Returns:
        List of effect names in the specified speed category.

    Raises:
        ValueError: If speed is not recognized.
    """
    speed_map = {
        "fast": FAST_EFFECTS,
        "medium": MEDIUM_EFFECTS,
        "slow": SLOW_EFFECTS,
    }

    if speed not in speed_map:
        raise ValueError(f"Unknown speed: {speed}. Use: fast, medium, slow")

    return speed_map[speed]


def set_theme(theme_name: str) -> None:
    """
    Set the global theme for banner effects.

    Args:
        theme_name: Name of the theme to use.

    Raises:
        ValueError: If theme_name is not recognized.
    """
    set_current_theme(theme_name)


def list_themes() -> list[str]:
    """
    Get a list of all available theme names.

    Returns:
        Sorted list of theme names.
    """
    return list_available_themes()


def get_current_theme() -> str:
    """
    Get the name of the currently active theme.

    Returns:
        Current theme name.
    """
    return get_current_theme_name()


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        if sys.argv[1] == "list":
            print("Available effects:")
            for effect in list_effects():
                print(f"  - {effect}")
        elif sys.argv[1] == "themes":
            print("Available themes:")
            from .themes import THEMES
            for theme_name, theme_data in sorted(THEMES.items()):
                current = " (current)" if theme_name == get_current_theme() else ""
                print(f"  - {theme_name}: {theme_data['description']}{current}")
        elif sys.argv[1] in ["fast", "medium", "slow"]:
            print(f"\n{sys.argv[1].upper()} effects:")
            for effect in get_effects_by_speed(sys.argv[1]):
                print(f"  - {effect}")
        else:
            try:
                show_banner(effect_name=sys.argv[1])
            except ValueError as e:
                print(f"Error: {e}")
                sys.exit(1)
    else:
        show_banner()
