#!/bin/bash

# Simple build script for hakcer package
set -e

echo "======================================"
echo "Building haKCer Package"
echo "======================================"
echo ""

# Clean previous builds
echo "[1/4] Cleaning previous builds..."
rm -rf build/ dist/ *.egg-info hakcer.egg-info
echo "  ✓ Cleaned"

# Install build tools
echo "[2/4] Installing build tools..."
python3 -m pip install --upgrade build twine --quiet
echo "  ✓ Build tools ready"

# Build package
echo "[3/4] Building package..."
python3 -m build
echo "  ✓ Package built"

# Validate
echo "[4/4] Validating package..."
python3 -m twine check dist/*
echo "  ✓ Package validated"

echo ""
echo "======================================"
echo "Build Complete!"
echo "======================================"
echo ""
echo "Distribution files:"
ls -lh dist/
echo ""
echo "To publish to PyPI:"
echo "  python3 -m twine upload dist/*"
echo ""
echo "To publish to TestPyPI:"
echo "  python3 -m twine upload --repository testpypi dist/*"
