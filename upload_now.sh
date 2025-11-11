#!/bin/bash

# Upload to PyPI using token from ~/.pypirc or environment variable

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }

echo ""
echo "======================================"
echo "Upload haKCer to PyPI"
echo "======================================"
echo ""

# Check if dist/ exists
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    print_error "dist/ directory is empty or missing"
    exit 1
fi

print_info "Distribution files:"
ls -lh dist/
echo ""

# Check for .pypirc
if [ -f "$HOME/.pypirc" ]; then
    print_success "Found .pypirc configuration"
    print_info "Uploading to PyPI using credentials from .pypirc..."
    python3 -m twine upload dist/* --verbose
else
    print_warning ".pypirc not found"
    print_info "You need to configure PyPI credentials"
    echo ""
    echo "Option 1: Use environment variable"
    echo "  export TWINE_USERNAME=__token__"
    echo "  export TWINE_PASSWORD=your-pypi-token-here"
    echo "  $0"
    echo ""
    echo "Option 2: Create ~/.pypirc"
    echo "  [pypi]"
    echo "  username = __token__"
    echo "  password = your-pypi-token-here"
    echo ""
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    print_success "Package uploaded to PyPI!"
    echo ""
    print_info "View at: https://pypi.org/project/hakcer/"
    print_info "Install with: pip install hakcer"
    echo ""

    # Tag the release
    print_info "Creating git tag..."
    if ! git rev-parse "v1.0.0" >/dev/null 2>&1; then
        git tag -a v1.0.0 -m "Release v1.0.0"
        git push origin v1.0.0
        print_success "Tagged v1.0.0"
    else
        print_info "Tag v1.0.0 already exists"
    fi
else
    print_error "Upload failed"
    exit 1
fi
