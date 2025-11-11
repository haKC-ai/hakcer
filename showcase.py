#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════╗
║              haKCer - Synthwave Demo & Showcase             ║
╚══════════════════════════════════════════════════════════════╝

An ultra-cool synthwave-themed interactive menu for showcasing
haKCer animations. Perfect for recording demos!
"""

import sys
import time
import os
import random
from pathlib import Path
from typing import Optional

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.prompt import Prompt, Confirm
from rich.text import Text
from rich.live import Live
from rich.layout import Layout
from rich.align import Align
from rich import box

from hakcer import show_banner, set_theme, list_themes, list_effects, get_effects_by_speed
from hakcer.themes import THEMES

# Pick random theme for menu colors
MENU_THEME = random.choice(list(THEMES.keys()))
MENU_COLORS = THEMES[MENU_THEME]["colors"]

# Map theme colors to menu display
SYNTHWAVE_COLORS = {
    "primary": f"#{MENU_COLORS['primary'][0]}",
    "secondary": f"#{MENU_COLORS['primary'][1] if len(MENU_COLORS['primary']) > 1 else MENU_COLORS['primary'][0]}",
    "accent": f"#{MENU_COLORS['accent'][0]}",
    "bg": f"#{MENU_COLORS['primary'][0]}",
    "text": "#ffffff",
    "neon": f"#{MENU_COLORS['accent'][1] if len(MENU_COLORS['accent']) > 1 else MENU_COLORS['accent'][0]}",
}

console = Console()


def print_synthwave_header():
    """Print a sick synthwave header."""
    header = Text()
    header.append("                     ████████████████████████ \n", style=f"bold {SYNTHWAVE_COLORS['primary']}")
    header.append("                     █   ███   ███████   ████\n", style=f"bold {SYNTHWAVE_COLORS['primary']}")
    header.append("                     █   ██   █████   ███   █\n", style=f"bold {SYNTHWAVE_COLORS['secondary']}")
    header.append(" ███                 █   █   █████   ████████\n", style=f"bold {SYNTHWAVE_COLORS['secondary']}")
    header.append(" ███         ███     █  █  ███████   ████████    ███     ██ ████ \n", style=f"bold {SYNTHWAVE_COLORS['accent']}")
    header.append(" █████     ███  ███  █   ██   ████   ████████  ██   ███   ███ \n", style=f"bold {SYNTHWAVE_COLORS['accent']}")
    header.append(" ███  ██  ███   ███  █   ███   ████   ███   █ █████████   ███ \n", style=f"bold {SYNTHWAVE_COLORS['neon']}")
    header.append(" ██   ███ ███   ███  █   █████   ████     ███ ██          ███\n", style=f"bold {SYNTHWAVE_COLORS['neon']}")
    header.append(" ██   ███   ███ ████ ████ S H O W C A S E ███   █████    ████", style=f"bold {SYNTHWAVE_COLORS['accent']}")

    console.print(Align.center(header))


def create_menu_table() -> Table:
    """Create a synthwave-styled menu table."""
    table = Table(
        title=Text("MAIN MENU", style=f"bold {SYNTHWAVE_COLORS['primary']}"),
        box=box.DOUBLE_EDGE,
        border_style=SYNTHWAVE_COLORS['secondary'],
        show_header=True,
        header_style=f"bold {SYNTHWAVE_COLORS['accent']}",
        title_style=f"bold {SYNTHWAVE_COLORS['neon']}"
    )

    table.add_column("Option", style=SYNTHWAVE_COLORS['primary'], justify="center", width=8)
    table.add_column("Action", style=SYNTHWAVE_COLORS['secondary'], width=35)
    table.add_column("Description", style="white", width=40)

    menu_items = [
        ("1", "Showcase All Effects", "Record-ready demo of all animations"),
        ("2", "Theme Gallery", "Browse all available themes"),
        ("3", "Quick Demo", "Single random effect (fast)"),
        ("4", "Custom Effect", "Choose specific effect + theme"),
        ("5", "Effect Browser", "Interactive effect selector"),
        ("6", "Speed Test", "Compare fast/medium/slow effects"),
        ("7", "Info", "List all themes & effects"),
        ("8", "Synthwave Mode", "Ultimate synthwave experience"),
        ("q", "Exit", "Quit the demo"),
    ]

    for option, action, desc in menu_items:
        table.add_row(option, action, desc)

    return table


def showcase_all_effects(hold_time: float = 1.5, clear_between: bool = True):
    """Showcase ALL effects with ALL themes - perfect for video recording."""
    console.print("\n")

    # Find custom banner files
    custom_banners = []
    custom_banners_dir = Path("custom_banners")
    if custom_banners_dir.exists() and custom_banners_dir.is_dir():
        available_banners = sorted([f for f in custom_banners_dir.glob("*.txt")])

        if available_banners:
            console.print(Panel(
                "[bold]Custom Banners Found[/bold]\n\n" +
                "\n".join([f"  [{idx}] {f.name}" for idx, f in enumerate(available_banners, 1)]),
                border_style="cyan",
                title="Available Custom Banners"
            ))

            console.print("\n[cyan]Selection Options:[/cyan]")
            console.print(f"  [white]'all'[/white] - Use default + all {len(available_banners)} custom banners (RECOMMENDED)")
            console.print(f"  [white]'1'[/white] - Use only {available_banners[0].name}")
            if len(available_banners) > 1:
                console.print(f"  [white]'2'[/white] - Use only {available_banners[1].name}")
            console.print("  [white]'1,2'[/white] - Use specific banners (comma-separated)")
            console.print("  [white]'custom'[/white] - Use all custom banners (no default)")
            console.print("  [white]'default'[/white] - Use only default haKCer banner\n")

            selection = Prompt.ask(
                "[yellow]Which banners to include?[/yellow]",
                default="all"
            ).strip().lower()

            if selection == "all":
                # Default + all custom banners
                custom_banners = available_banners
            elif selection == "custom":
                # All custom, skip default
                custom_banners = available_banners
                banners = custom_banners
                # Skip adding None later

                # Ask for speed preference
                console.print("\n[cyan]Effect Speed Options:[/cyan]")
                console.print("  [white]'fast'[/white] - 10 effects, quick animations (~15 min for all combos)")
                console.print("  [white]'medium'[/white] - 10 effects, moderate speed (~25 min for all combos)")
                console.print("  [white]'slow'[/white] - 9 effects, longer animations (~40 min for all combos)")
                console.print("  [white]'all'[/white] - All 29 effects (~90 min for all combos)\n")

                speed_choice = Prompt.ask(
                    "[yellow]Which speed preference?[/yellow]",
                    choices=["fast", "medium", "slow", "all"],
                    default="fast"
                ).strip().lower()

                console.print(Panel(
                    "[bold cyan]SHOWCASE MODE ACTIVATED[/bold cyan]\n\n"
                    "Recording-optimized demo of all effects across all themes!\n"
                    "Perfect for creating promotional videos.\n\n"
                    f"Hold time: {hold_time}s | Clear between: {clear_between}\n"
                    f"Banners: {len(custom_banners)} custom (no default)\n"
                    f"Speed: {speed_choice}",
                    border_style="bright_magenta",
                    box=box.DOUBLE
                ))

                themes = list_themes()
                if speed_choice == "all":
                    all_effects = list_effects()
                else:
                    all_effects = get_effects_by_speed(speed_choice)
                total_combos = len(themes) * len(all_effects) * len(banners)
                console.print(f"\n[yellow]Total combinations: {total_combos}[/yellow]")
                console.print(f"[yellow]Estimated time: {total_combos * (hold_time + 0.5):.0f}s[/yellow]\n")

                if not Confirm.ask("[bold]Ready to start showcase?[/bold]", default=True):
                    return

                console.print("\n[bold green]Starting in 3...[/bold green]")
                time.sleep(1)
                console.print("[bold green]2...[/bold green]")
                time.sleep(1)
                console.print("[bold green]1...[/bold green]")
                time.sleep(1)

                count = 0
                for banner_file in banners:
                    banner_name = banner_file.name
                    for theme in themes:
                        for effect in all_effects:
                            count += 1
                            console.print(f"\n[bold cyan]━━━ {count}/{total_combos} ━━━[/bold cyan]")
                            console.print(f"[yellow]Banner:[/yellow] {banner_name}")
                            console.print(f"[magenta]Theme:[/magenta] {theme}")
                            console.print(f"[cyan]Effect:[/cyan] {effect}")
                            time.sleep(0.5)

                            set_theme(theme)
                            try:
                                show_banner(custom_file=str(banner_file), effect_name=effect, hold_time=hold_time)
                            except Exception as e:
                                console.print(f"[red]Error with {effect}: {e}[/red]")
                                continue

                            if clear_between and count < total_combos:
                                console.clear()

                console.print("\n")
                console.print(Panel(
                    "[bold green]SHOWCASE COMPLETE![/bold green]\n\n"
                    f"Displayed {total_combos} effect combinations!\n"
                    f"Banners: {len(custom_banners)} custom",
                    border_style="bright_green",
                    box=box.DOUBLE
                ))
                return
            elif selection == "default":
                # Only default banner, no custom
                custom_banners = []
            elif selection.replace(',', '').replace(' ', '').isdigit():
                try:
                    indices = [int(x.strip()) - 1 for x in selection.split(",")]
                    custom_banners = [available_banners[i] for i in indices if 0 <= i < len(available_banners)]
                except (ValueError, IndexError):
                    console.print("[red]Invalid selection, using all banners[/red]")
                    custom_banners = available_banners
            else:
                console.print("[red]Invalid selection, using all banners[/red]")
                custom_banners = available_banners

    # Prepare banner list (default + custom)
    banners = [None] + custom_banners  # None = default haKCer banner

    # Ask for speed preference
    console.print("\n[cyan]Effect Speed Options:[/cyan]")
    console.print("  [white]'fast'[/white] - 10 effects, quick animations (~15 min for all combos)")
    console.print("  [white]'medium'[/white] - 10 effects, moderate speed (~25 min for all combos)")
    console.print("  [white]'slow'[/white] - 9 effects, longer animations (~40 min for all combos)")
    console.print("  [white]'all'[/white] - All 29 effects (~90 min for all combos)\n")

    speed_choice = Prompt.ask(
        "[yellow]Which speed preference?[/yellow]",
        choices=["fast", "medium", "slow", "all"],
        default="fast"
    ).strip().lower()

    console.print(Panel(
        "[bold cyan]SHOWCASE MODE ACTIVATED[/bold cyan]\n\n"
        "Recording-optimized demo of all effects across all themes!\n"
        "Perfect for creating promotional videos.\n\n"
        f"Hold time: {hold_time}s | Clear between: {clear_between}\n"
        f"Banners: Default + {len(custom_banners)} custom\n"
        f"Speed: {speed_choice}",
        border_style="bright_magenta",
        box=box.DOUBLE
    ))

    themes = list_themes()
    if speed_choice == "all":
        all_effects = list_effects()
    else:
        all_effects = get_effects_by_speed(speed_choice)

    total_combos = len(themes) * len(all_effects) * len(banners)
    console.print(f"\n[yellow]Total combinations: {total_combos}[/yellow]")
    console.print(f"[yellow]Estimated time: {total_combos * (hold_time + 0.5):.0f}s[/yellow]\n")

    if not Confirm.ask("[bold]Ready to start showcase?[/bold]", default=True):
        return

    console.print("\n[bold green]Starting in 3...[/bold green]")
    time.sleep(1)
    console.print("[bold green]2...[/bold green]")
    time.sleep(1)
    console.print("[bold green]1...[/bold green]")
    time.sleep(1)

    count = 0
    banner_index = 0

    for theme in themes:
        for effect in all_effects:
            count += 1

            # Rotate through banners
            banner_file = banners[banner_index % len(banners)]
            banner_name = "Default haKCer" if banner_file is None else banner_file.name
            banner_index += 1

            # Show progress
            console.print(f"\n[bold cyan]━━━ {count}/{total_combos} ━━━[/bold cyan]")
            console.print(f"[yellow]Banner:[/yellow] {banner_name}")
            console.print(f"[magenta]Theme:[/magenta] {theme}")
            console.print(f"[cyan]Effect:[/cyan] {effect}")
            time.sleep(0.5)

            # Show the effect
            set_theme(theme)
            try:
                if banner_file is None:
                    # Use default banner
                    show_banner(effect_name=effect, hold_time=hold_time)
                else:
                    # Use custom banner
                    show_banner(
                        custom_file=str(banner_file),
                        effect_name=effect,
                        hold_time=hold_time
                    )
            except Exception as e:
                console.print(f"[red]Error with {effect}: {e}[/red]")
                continue

            if clear_between and count < total_combos:
                console.clear()

    console.print("\n")
    console.print(Panel(
        "[bold green]SHOWCASE COMPLETE![/bold green]\n\n"
        f"Displayed {total_combos} effect combinations!\n"
        f"Banners: Default + {len(custom_banners)} custom",
        border_style="bright_green",
        box=box.DOUBLE
    ))


def theme_gallery():
    """Interactive theme gallery."""
    from hakcer.themes import THEMES

    console.print("\n")
    themes_table = Table(
        title=Text("THEME GALLERY", style=f"bold {SYNTHWAVE_COLORS['primary']}"),
        box=box.DOUBLE_EDGE,
        border_style=SYNTHWAVE_COLORS['secondary'],
        show_header=True,
        header_style=f"bold {SYNTHWAVE_COLORS['accent']}"
    )

    themes_table.add_column("#", style="cyan", width=4)
    themes_table.add_column("Theme Name", style="magenta", width=25)
    themes_table.add_column("Description", style="white", width=45)

    theme_list = sorted(THEMES.items())
    for idx, (name, data) in enumerate(theme_list, 1):
        themes_table.add_row(str(idx), name, data['description'])

    console.print(themes_table)

    if Confirm.ask("\n[bold]Preview a theme?[/bold]", default=True):
        theme_choice = Prompt.ask(
            "[cyan]Enter theme name[/cyan]",
            choices=list(THEMES.keys()),
            default="synthwave"
        )

        console.print(f"\n[bold]Previewing {theme_choice}...[/bold]\n")
        set_theme(theme_choice)
        show_banner(speed_preference="fast", hold_time=2.0)


def quick_demo():
    """Quick random effect demo."""
    console.print(Panel(
        "[bold]QUICK DEMO[/bold]\n\nShowing random fast effect...",
        border_style="yellow"
    ))

    set_theme("synthwave")
    time.sleep(0.5)
    show_banner(speed_preference="fast", hold_time=1.5)


def custom_effect():
    """Choose custom effect and theme."""
    from hakcer.themes import THEMES

    console.print("\n[bold cyan]CUSTOM EFFECT CREATOR[/bold cyan]\n")

    # Choose theme
    theme = Prompt.ask(
        "[magenta]Choose theme[/magenta]",
        choices=list(THEMES.keys()),
        default="synthwave"
    )

    # Choose effect
    effect = Prompt.ask(
        "[cyan]Choose effect[/cyan]",
        choices=list_effects(),
        default="synthgrid"
    )

    # Choose hold time
    hold_time = float(Prompt.ask(
        "[yellow]Hold time (seconds)[/yellow]",
        default="2.0"
    ))

    console.print(f"\n[bold green]Configuration set![/bold green]")
    console.print(f"Theme: {theme} | Effect: {effect} | Hold: {hold_time}s\n")
    time.sleep(1)

    set_theme(theme)
    show_banner(effect_name=effect, hold_time=hold_time)


def effect_browser():
    """Interactive effect browser."""
    console.print("\n")

    # Create effects table by speed
    for speed in ["fast", "medium", "slow"]:
        effects = get_effects_by_speed(speed)

        color = "green" if speed == "fast" else "yellow" if speed == "medium" else "red"
        console.print(f"\n[bold {color}]{speed.upper()} EFFECTS ({len(effects)})[/bold {color}]")

        # Create columns of effects
        effects_per_row = 4
        for i in range(0, len(effects), effects_per_row):
            row = effects[i:i+effects_per_row]
            console.print("  • " + " | ".join(row))

    if Confirm.ask("\n[bold]Try an effect?[/bold]", default=True):
        effect = Prompt.ask(
            "[cyan]Enter effect name[/cyan]",
            choices=list_effects(),
            default="synthgrid"
        )

        console.print(f"\n[bold]Showing {effect}...[/bold]\n")
        set_theme("synthwave")
        show_banner(effect_name=effect, hold_time=2.0)


def speed_test():
    """Compare different speed categories."""
    console.print(Panel(
        "[bold]SPEED TEST[/bold]\n\nComparing Fast → Medium → Slow effects",
        border_style="red"
    ))

    set_theme("cyberpunk")

    for speed in ["fast", "medium", "slow"]:
        console.print(f"\n[bold yellow]━━━ {speed.upper()} SPEED ━━━[/bold yellow]")
        time.sleep(1)
        show_banner(speed_preference=speed, hold_time=1.5)


def show_info():
    """Display all available themes and effects."""
    from hakcer.themes import THEMES

    console.print("\n")

    # Themes
    console.print(Panel(
        f"[bold cyan]Available Themes ({len(THEMES)})[/bold cyan]\n\n" +
        ", ".join([f"[magenta]{name}[/magenta]" for name in sorted(THEMES.keys())]),
        border_style="cyan"
    ))

    # Effects by speed
    console.print("\n")
    for speed in ["fast", "medium", "slow"]:
        effects = get_effects_by_speed(speed)
        color = "green" if speed == "fast" else "yellow" if speed == "medium" else "red"
        console.print(Panel(
            f"[bold {color}]{speed.upper()} Effects ({len(effects)})[/bold {color}]\n\n" +
            ", ".join([f"[white]{e}[/white]" for e in effects]),
            border_style=color
        ))


def synthwave_mode():
    """Ultimate synthwave experience!"""
    console.print("\n")
    console.print(Panel(
        "[bold magenta]SYNTHWAVE MODE ACTIVATED[/bold magenta]\n\n"
        "Buckle up for the ultimate retro-futuristic experience!\n"
        "Featuring the best synthwave effects with epic themes.",
        border_style="bright_magenta",
        box=box.DOUBLE,
        padding=(1, 2)
    ))

    time.sleep(1)

    # Ultimate synthwave experience
    synthwave_combos = [
        ("synthwave", "synthgrid"),
        ("cyberpunk", "matrix"),
        ("neon", "fireworks"),
        ("tokyo_night", "waves"),
        ("cyberpunk", "vhstape"),
    ]

    for idx, (theme, effect) in enumerate(synthwave_combos, 1):
        console.print(f"\n[bold cyan]━━━ COMBO {idx}/{len(synthwave_combos)} ━━━[/bold cyan]")
        console.print(f"[magenta]{theme}[/magenta] × [cyan]{effect}[/cyan]")
        time.sleep(1)

        set_theme(theme)
        show_banner(effect_name=effect, hold_time=2.0)

        if idx < len(synthwave_combos):
            time.sleep(1)

    console.print("\n")
    console.print(Panel(
        "[bold green]SYNTHWAVE MODE COMPLETE![/bold green]\n\n"
        "Hope you enjoyed the ride!",
        border_style="bright_green"
    ))


def main():
    """Main menu loop."""
    while True:
        console.clear()
        print_synthwave_header()
        console.print("\n")

        menu = create_menu_table()
        console.print(Align.center(menu))

        console.print("\n")
        choice = Prompt.ask(
            "[bold cyan]Choose your destiny[/bold cyan]",
            default="8"
        ).lower()

        if choice == "q":
            console.print("\n[bold magenta]Thanks for using haKCer! See you in the grid...[/bold magenta]\n")
            break
        elif choice == "1":
            # Showcase mode - ask for preferences
            console.print("\n[bold]Showcase Configuration:[/bold]")
            hold = float(Prompt.ask("[yellow]Hold time per effect (seconds)[/yellow]", default="1.5"))
            clear = Confirm.ask("[yellow]Clear screen between effects?[/yellow]", default=True)
            showcase_all_effects(hold_time=hold, clear_between=clear)
        elif choice == "2":
            theme_gallery()
        elif choice == "3":
            quick_demo()
        elif choice == "4":
            custom_effect()
        elif choice == "5":
            effect_browser()
        elif choice == "6":
            speed_test()
        elif choice == "7":
            show_info()
        elif choice == "8":
            synthwave_mode()
        else:
            console.print(f"[red]Invalid choice: {choice}[/red]")

        if choice != "q":
            console.print("\n")
            Prompt.ask("[dim]Press Enter to return to menu[/dim]", default="")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n\n[yellow]Interrupted! Exiting...[/yellow]\n")
        sys.exit(0)
