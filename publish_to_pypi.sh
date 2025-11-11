#!/bin/bash

# haKCer - Automated PyPI Publishing Script
# This script handles all the steps to build and publish the package to PyPI

set -e  # Exit on any error

echo "======================================"
echo "haKCer PyPI Publishing Script"
echo "======================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Step 1: Check if we're in the right directory
echo "[Step 1/9] Checking directory structure..."
if [ ! -f "setup.py" ] || [ ! -d "hakcer" ]; then
    print_error "Error: setup.py or hakcer/ directory not found!"
    print_warning "Please run this script from the root directory containing setup.py"
    exit 1
fi
print_success "Directory structure verified"
echo ""

# Step 2: Check Python version
echo "[Step 2/9] Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
print_success "Python $python_version detected"
echo ""

# Step 3: Install/upgrade build tools
echo "[Step 3/9] Installing/upgrading build tools..."
python3 -m pip install --upgrade pip setuptools wheel build twine
print_success "Build tools updated"
echo ""

# Step 4: Clean previous builds
echo "[Step 4/9] Cleaning previous builds..."
rm -rf build/ dist/ *.egg-info hakcer.egg-info
print_success "Previous builds cleaned"
echo ""

# Step 5: Run basic tests
echo "[Step 5/9] Running basic package tests..."
if python3 -c "from hakcer import show_banner, set_theme, list_themes; print('Import test passed')"; then
    print_success "Package imports successfully"
else
    print_error "Package import failed!"
    exit 1
fi
echo ""

# Step 6: Build the package
echo "[Step 6/9] Building the package..."
python3 -m build
print_success "Package built successfully"
echo ""

# Step 7: Check the distribution
echo "[Step 7/9] Checking package distribution..."
python3 -m twine check dist/*
print_success "Package distribution valid"
echo ""

# Step 8: Display package contents
echo "[Step 8/9] Package contents:"
echo "Files in dist/:"
ls -lh dist/
echo ""

# Step 9: Upload options
echo "[Step 9/9] Upload to PyPI"
echo ""
echo "Choose upload destination:"
echo "  1) TestPyPI (recommended for first-time testing)"
echo "  2) PyPI (production - requires account)"
echo "  3) Skip upload"
echo ""
read -p "Enter choice (1-3): " upload_choice

case $upload_choice in
    1)
        echo ""
        print_warning "Uploading to TestPyPI..."
        print_warning "You'll need a TestPyPI account: https://test.pypi.org/account/register/"
        echo ""
        python3 -m twine upload --repository testpypi dist/*
        print_success "Uploaded to TestPyPI!"
        echo ""
        echo "To install from TestPyPI, run:"
        echo "  pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer"
        ;;
    2)
        echo ""
        print_warning "Uploading to PyPI (Production)..."
        print_warning "You'll need a PyPI account: https://pypi.org/account/register/"
        echo ""
        read -p "Are you sure you want to upload to production PyPI? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            python3 -m twine upload dist/*
            print_success "Uploaded to PyPI!"
            echo ""
            echo "Your package is now live! Users can install it with:"
            echo "  pip install hakcer"
        else
            print_warning "Upload cancelled"
        fi
        ;;
    3)
        print_warning "Skipping upload. Package built successfully in dist/"
        echo ""
        echo "To upload later, run one of:"
        echo "  TestPyPI: python3 -m twine upload --repository testpypi dist/*"
        echo "  PyPI:     python3 -m twine upload dist/*"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "======================================"
print_success "Process Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Test installation: pip install hakcer"
echo "  2. Try it out: python3 -c 'from hakcer import show_banner; show_banner()'"
echo "  3. Check themes: python3 -c 'from hakcer import list_themes; print(list_themes())'"
echo ""
echo "Documentation: https://pypi.org/project/hakcer/"
