#!/bin/bash

# Setup PyPI token for publishing

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }

echo ""
echo "======================================"
echo "Setup PyPI Token"
echo "======================================"
echo ""

if [ -f "$HOME/.pypirc" ]; then
    print_warning ".pypirc already exists"
    cat "$HOME/.pypirc"
    echo ""
    read -p "Overwrite? (yes/no): " overwrite
    if [ "$overwrite" != "yes" ]; then
        print_info "Cancelled"
        exit 0
    fi
fi

echo "Enter your PyPI token (starts with 'pypi-'):"
echo "(Get it from: https://pypi.org/manage/account/token/)"
echo ""
read -p "Token: " token

if [ -z "$token" ]; then
    print_warning "No token provided"
    exit 1
fi

# Create .pypirc
cat > "$HOME/.pypirc" <<EOF
[pypi]
username = __token__
password = $token

[testpypi]
username = __token__
password = $token
EOF

chmod 600 "$HOME/.pypirc"

print_success "Created $HOME/.pypirc"
echo ""
print_info "Now run: ./upload_now.sh"
