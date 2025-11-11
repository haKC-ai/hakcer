#!/usr/bin/env python3
"""
haKCer Usage Examples

Demonstrates various ways to use the haKCer package in your CLI applications.
"""

import sys
import time


def example1_basic():
    """Example 1: Basic usage with default settings."""
    print("\n" + "=" * 60)
    print("Example 1: Basic Usage")
    print("=" * 60)

    from hakcer import show_banner

    # Just show the banner with defaults (synthwave theme, fast random effect)
    show_banner()


def example2_themes():
    """Example 2: Using different themes."""
    print("\n" + "=" * 60)
    print("Example 2: Theme Showcase")
    print("=" * 60)

    from hakcer import show_banner, set_theme, list_themes

    # Show all available themes
    print("Available themes:", ", ".join(list_themes()))
    print()

    # Demo a few themes
    themes_to_demo = ["tokyo_night", "cyberpunk", "neon"]

    for theme in themes_to_demo:
        print(f"\nShowing {theme} theme...")
        time.sleep(1)
        set_theme(theme)
        show_banner(effect_name="slide", hold_time=1.0)


def example3_specific_effects():
    """Example 3: Using specific effects."""
    print("\n" + "=" * 60)
    print("Example 3: Specific Effects")
    print("=" * 60)

    from hakcer import show_banner, set_theme

    set_theme("tokyo_night_storm")

    effects_to_demo = ["decrypt", "synthgrid", "matrix"]

    for effect in effects_to_demo:
        print(f"\nShowing {effect} effect...")
        time.sleep(1)
        show_banner(effect_name=effect, hold_time=0.5)


def example4_cli_integration():
    """Example 4: CLI tool integration with Click."""
    print("\n" + "=" * 60)
    print("Example 4: CLI Integration (simulated)")
    print("=" * 60)

    # Note: This would normally use click, but we'll simulate it
    from hakcer import show_banner, set_theme, list_themes

    # Simulate CLI with banner
    class Args:
        no_banner = False
        theme = "cyberpunk"
        effect = None

    args = Args()

    if not args.no_banner:
        set_theme(args.theme)
        if args.effect:
            show_banner(effect_name=args.effect)
        else:
            show_banner(speed_preference="fast")

    print("\n✓ CLI tool started successfully!")


def example5_speed_preferences():
    """Example 5: Different speed preferences."""
    print("\n" + "=" * 60)
    print("Example 5: Speed Preferences")
    print("=" * 60)

    from hakcer import show_banner, set_theme

    set_theme("neon")

    speeds = ["fast", "medium"]

    for speed in speeds:
        print(f"\nShowing {speed} effect...")
        time.sleep(1)
        show_banner(speed_preference=speed, hold_time=0.5)


def example6_smart_terminal_detection():
    """Example 6: Smart terminal detection."""
    print("\n" + "=" * 60)
    print("Example 6: Smart Terminal Detection")
    print("=" * 60)

    from hakcer import show_banner, set_theme

    # Only show banner in interactive terminals
    if sys.stdout.isatty():
        print("Interactive terminal detected, showing banner...")
        set_theme("dracula")
        show_banner(speed_preference="fast", hold_time=1.0)
    else:
        print("Non-interactive terminal, skipping banner")


def example7_list_all_features():
    """Example 7: List all available features."""
    print("\n" + "=" * 60)
    print("Example 7: Available Features")
    print("=" * 60)

    from hakcer import list_themes, list_effects, get_effects_by_speed
    from hakcer.themes import THEMES

    # Show all themes with descriptions
    print("\nAvailable Themes:")
    print("-" * 60)
    for theme_name, theme_data in sorted(THEMES.items()):
        print(f"  {theme_name:20} - {theme_data['description']}")

    # Show all effects by speed
    print("\nAvailable Effects by Speed:")
    print("-" * 60)
    for speed in ["fast", "medium", "slow"]:
        effects = get_effects_by_speed(speed)
        print(f"  {speed.upper():10} ({len(effects):2}): {', '.join(effects)}")


def example8_production_ready():
    """Example 8: Production-ready CLI tool."""
    print("\n" + "=" * 60)
    print("Example 8: Production-Ready Setup")
    print("=" * 60)

    import os
    from hakcer import show_banner, set_theme

    # Check environment variable for banner display
    show_banner_enabled = os.getenv("SHOW_BANNER", "true").lower() == "true"

    # Check if in TTY (interactive terminal)
    is_interactive = sys.stdout.isatty()

    # Get theme from environment or use default
    theme = os.getenv("HAKCER_THEME", "tokyo_night")

    if show_banner_enabled and is_interactive:
        print("Initializing CLI tool...")
        set_theme(theme)
        show_banner(speed_preference="fast", hold_time=1.0)

    print("\n✓ Production CLI tool initialized")
    print("  - Banner enabled:", show_banner_enabled)
    print("  - Interactive:", is_interactive)
    print("  - Theme:", theme)


def example9_error_handling():
    """Example 9: Proper error handling."""
    print("\n" + "=" * 60)
    print("Example 9: Error Handling")
    print("=" * 60)

    from hakcer import show_banner, set_theme

    # Handle invalid theme gracefully
    try:
        set_theme("nonexistent_theme")
    except ValueError as e:
        print(f"✗ Invalid theme error (expected): {e}")
        print("✓ Falling back to default theme")
        set_theme("synthwave")

    # Handle invalid effect gracefully
    try:
        show_banner(effect_name="nonexistent_effect")
    except ValueError as e:
        print(f"✗ Invalid effect error (expected): {e}")
        print("✓ Using random effect instead")
        show_banner(speed_preference="fast", hold_time=0.5)


def example10_custom_configurations():
    """Example 10: Custom configurations."""
    print("\n" + "=" * 60)
    print("Example 10: Custom Configurations")
    print("=" * 60)

    from hakcer import show_banner, set_theme

    print("\nConfiguration 1: Quick splash")
    set_theme("matrix")
    show_banner(effect_name="decrypt", hold_time=0.3)

    time.sleep(1)

    print("\nConfiguration 2: Impressive demo")
    set_theme("cyberpunk")
    show_banner(effect_name="synthgrid", hold_time=2.0)

    time.sleep(1)

    print("\nConfiguration 3: Minimal")
    set_theme("nord")
    show_banner(effect_name="wipe", hold_time=0.5, clear_after=False)


def main():
    """Run all examples or a specific one."""
    examples = {
        "1": ("Basic Usage", example1_basic),
        "2": ("Theme Showcase", example2_themes),
        "3": ("Specific Effects", example3_specific_effects),
        "4": ("CLI Integration", example4_cli_integration),
        "5": ("Speed Preferences", example5_speed_preferences),
        "6": ("Terminal Detection", example6_smart_terminal_detection),
        "7": ("List Features", example7_list_all_features),
        "8": ("Production Ready", example8_production_ready),
        "9": ("Error Handling", example9_error_handling),
        "10": ("Custom Config", example10_custom_configurations),
    }

    if len(sys.argv) > 1:
        # Run specific example
        example_num = sys.argv[1]
        if example_num in examples:
            name, func = examples[example_num]
            print(f"\nRunning: {name}")
            func()
        else:
            print(f"Unknown example: {example_num}")
            print(f"Available: {', '.join(sorted(examples.keys()))}")
            sys.exit(1)
    else:
        # Show menu
        print("\n" + "=" * 60)
        print("haKCer Examples Menu")
        print("=" * 60)
        print("\nAvailable examples:")
        for num, (name, _) in sorted(examples.items()):
            print(f"  {num}. {name}")
        print("\nUsage:")
        print("  python examples.py [example_number]")
        print("  python examples.py 1    # Run example 1")
        print("  python examples.py 7    # List all features")
        print("\nOr run with no arguments to see this menu.")


if __name__ == "__main__":
    main()
