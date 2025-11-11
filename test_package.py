#!/usr/bin/env python3
"""
Quick test script for haKCer package functionality.
Run this before publishing to ensure everything works.
"""

import sys
from pathlib import Path

# Add the package to path for local testing
sys.path.insert(0, str(Path(__file__).parent))

def test_imports():
    """Test that all imports work."""
    print("Testing imports...")
    try:
        from hakcer import (
            show_banner,
            list_effects,
            get_effects_by_speed,
            set_theme,
            list_themes,
            get_current_theme,
            THEMES,
        )
        print("✓ All imports successful")
        return True
    except ImportError as e:
        print(f"✗ Import failed: {e}")
        return False


def test_themes():
    """Test theme functionality."""
    print("\nTesting themes...")
    try:
        from hakcer import list_themes, set_theme, get_current_theme, THEMES

        themes = list_themes()
        print(f"✓ Found {len(themes)} themes: {', '.join(themes)}")

        # Test theme data
        for theme_name in themes:
            if theme_name not in THEMES:
                print(f"✗ Theme {theme_name} missing from THEMES dict")
                return False
            theme_data = THEMES[theme_name]
            if "name" not in theme_data or "colors" not in theme_data:
                print(f"✗ Theme {theme_name} missing required fields")
                return False
        print(f"✓ All {len(themes)} themes have valid structure")

        # Test setting themes
        original = get_current_theme()
        for theme in ["tokyo_night", "cyberpunk", "neon"]:
            set_theme(theme)
            if get_current_theme() != theme:
                print(f"✗ Failed to set theme: {theme}")
                return False
        set_theme(original)
        print(f"✓ Theme switching works correctly")

        return True
    except Exception as e:
        print(f"✗ Theme test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_effects():
    """Test effect functionality."""
    print("\nTesting effects...")
    try:
        from hakcer import list_effects, get_effects_by_speed

        all_effects = list_effects()
        print(f"✓ Found {len(all_effects)} effects")

        fast = get_effects_by_speed("fast")
        medium = get_effects_by_speed("medium")
        slow = get_effects_by_speed("slow")

        print(f"✓ Fast: {len(fast)}, Medium: {len(medium)}, Slow: {len(slow)}")

        if len(fast) + len(medium) + len(slow) != len(all_effects):
            print(f"✗ Effect counts don't match")
            return False

        print("✓ All effects categorized correctly")
        return True
    except Exception as e:
        print(f"✗ Effect test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_banner_display():
    """Test banner display (quick test only)."""
    print("\nTesting banner display...")
    try:
        from hakcer import show_banner, set_theme

        print("Testing Tokyo Night theme with fast effect...")
        set_theme("tokyo_night")
        show_banner(effect_name="slide", hold_time=0.5)

        print("✓ Banner displayed successfully")
        return True
    except Exception as e:
        print(f"✗ Banner display failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_api_functions():
    """Test all API functions."""
    print("\nTesting API functions...")
    try:
        from hakcer import show_banner, set_theme, list_themes, list_effects

        # Test list_themes
        themes = list_themes()
        if not isinstance(themes, list) or len(themes) == 0:
            print("✗ list_themes() failed")
            return False
        print(f"✓ list_themes() returns {len(themes)} themes")

        # Test list_effects
        effects = list_effects()
        if not isinstance(effects, list) or len(effects) == 0:
            print("✗ list_effects() failed")
            return False
        print(f"✓ list_effects() returns {len(effects)} effects")

        # Test set_theme with invalid theme
        try:
            set_theme("nonexistent_theme")
            print("✗ set_theme() should raise ValueError for invalid theme")
            return False
        except ValueError:
            print("✓ set_theme() properly validates theme names")

        return True
    except Exception as e:
        print(f"✗ API test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def run_all_tests():
    """Run all tests."""
    print("=" * 60)
    print("haKCer Package Test Suite")
    print("=" * 60)

    tests = [
        ("Imports", test_imports),
        ("Themes", test_themes),
        ("Effects", test_effects),
        ("API Functions", test_api_functions),
        ("Banner Display", test_banner_display),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"✗ {test_name} crashed: {e}")
            results.append((test_name, False))

    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)

    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")

    passed = sum(1 for _, r in results if r)
    total = len(results)

    print("\n" + "=" * 60)
    print(f"Results: {passed}/{total} tests passed")
    print("=" * 60)

    if passed == total:
        print("\n🎉 All tests passed! Ready to publish.")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Fix issues before publishing.")
        return 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
