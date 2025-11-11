#!/usr/bin/env python3
"""Test custom banner feature"""

import sys
sys.path.insert(0, '.')

from hakcer import show_banner, set_theme

print("=" * 60)
print("Testing Custom Banner Feature")
print("=" * 60)

# Test 1: Custom text directly
print("\n1. Custom text (inline):")
custom_art = """
╔═══════════════════╗
║   CUSTOM BANNER   ║
║   ═══════════     ║
║   Made Easy!      ║
╚═══════════════════╝
"""
set_theme("cyberpunk")
show_banner(custom_text=custom_art, effect_name="wipe", hold_time=1.5)

# Test 2: From file - Hello World
print("\n2. Custom banner from file (hello.txt):")
set_theme("neon")
show_banner(custom_file="custom_banners/hello.txt", effect_name="slide", hold_time=1.5)

# Test 3: From file - Neon Night
print("\n3. Custom banner from file (neon.txt):")
set_theme("tokyo_night")
show_banner(custom_file="custom_banners/neon.txt", effect_name="expand", hold_time=1.5)

# Test 4: From file - Rocket
print("\n4. Custom banner from file (rocket.txt):")
set_theme("synthwave")
show_banner(custom_file="custom_banners/rocket.txt", effect_name="scattered", hold_time=1.5)

print("\n" + "=" * 60)
print("✓ All custom banner tests completed!")
print("=" * 60)
