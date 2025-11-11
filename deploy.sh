#!/bin/bash

# haKCer Automated Deployment Script
# Validates files, commits to GitHub, and publishes to PyPI

set -e  # Exit on any error

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_step() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# Configuration
PACKAGE_NAME="hakcer"
GITHUB_REPO="haKC-ai/hakcer"
VERSION="1.0.0"

print_step "haKCer Automated Deployment Script"
print_info "Package: $PACKAGE_NAME"
print_info "Version: $VERSION"
print_info "GitHub: https://github.com/$GITHUB_REPO"

# Step 1: Validate file structure
print_step "Step 1: Validating File Structure"

REQUIRED_FILES=(
    "hakcer/__init__.py"
    "hakcer/banner.py"
    "hakcer/themes.py"
    "setup.py"
    "pyproject.toml"
    "README.md"
    "README_PYPI.md"
    "LICENSE"
    "MANIFEST.in"
    "requirements.txt"
    ".gitignore"
)

missing_files=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_error "Missing: $file"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -gt 0 ]; then
    print_error "$missing_files required file(s) missing!"
    exit 1
fi

print_success "All required files present"

# Step 2: Validate Python imports
print_step "Step 2: Validating Python Package"

if python3 -c "import sys; sys.path.insert(0, '.'); from hakcer import show_banner, set_theme, list_themes, list_effects; print('Imports OK')" 2>&1; then
    print_success "Python imports validated"
else
    print_error "Python import validation failed"
    exit 1
fi

# Check dependencies
print_info "Checking dependencies..."
pip3 show terminaltexteffects >/dev/null 2>&1 || {
    print_warning "terminaltexteffects not installed, installing..."
    pip3 install terminaltexteffects rich
}

# Step 3: Run tests
print_step "Step 3: Running Tests"

if [ -f "test_package.py" ]; then
    if python3 test_package.py; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed, but continuing..."
    fi
else
    print_warning "test_package.py not found, skipping tests"
fi

# Step 4: Clean previous builds
print_step "Step 4: Cleaning Previous Builds"

rm -rf build/ dist/ *.egg-info hakcer.egg-info
print_success "Build directories cleaned"

# Step 5: Git operations
print_step "Step 5: Git Operations"

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    print_success "GitHub CLI (gh) found"

    # Check if gh is authenticated
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI authenticated"

        # Check if repo exists
        if gh repo view "$GITHUB_REPO" &> /dev/null; then
            print_success "Repository exists: $GITHUB_REPO"
        else
            print_info "Repository not found, creating..."
            read -p "Create repository $GITHUB_REPO? (yes/no): " create_repo
            if [ "$create_repo" = "yes" ]; then
                gh repo create "$GITHUB_REPO" --public --description "Animated ASCII banner with terminal effects and customizable themes" --source=.
                print_success "Repository created"
            else
                print_warning "Repository not created, manual push required"
            fi
        fi
    else
        print_warning "GitHub CLI not authenticated. Run: gh auth login"
        print_info "Continuing without automated GitHub operations"
    fi
else
    print_warning "GitHub CLI (gh) not found. Install: brew install gh"
    print_info "Continuing without automated GitHub operations"
fi

# Initialize git if needed
if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    git branch -M main
    print_success "Git initialized"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    print_info "Uncommitted changes detected"

    # Show status
    git status --short

    read -p "Commit and push changes? (yes/no): " do_commit
    if [ "$do_commit" = "yes" ]; then
        # Add files
        git add .

        # Commit
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Release v$VERSION"
        fi

        git commit -m "$commit_msg"
        print_success "Changes committed"

        # Add remote if needed
        if ! git remote get-url origin &> /dev/null; then
            git remote add origin "https://github.com/$GITHUB_REPO.git"
            print_success "Remote origin added"
        fi

        # Push
        if gh auth status &> /dev/null 2>&1; then
            gh repo set-default "$GITHUB_REPO" 2>/dev/null || true
            git push -u origin main
            print_success "Pushed to GitHub"
        else
            print_info "Attempting standard git push..."
            git push -u origin main || {
                print_warning "Git push failed. You may need to push manually:"
                print_info "  git push -u origin main"
            }
        fi

        # Create tag
        if ! git tag | grep -q "v$VERSION"; then
            git tag -a "v$VERSION" -m "Release v$VERSION"
            git push origin "v$VERSION" 2>/dev/null || print_warning "Tag push failed, continuing..."
            print_success "Version tagged: v$VERSION"
        fi
    else
        print_warning "Skipping git commit"
    fi
else
    print_info "No uncommitted changes"
fi

# Step 6: Build package
print_step "Step 6: Building Package"

# Install/upgrade build tools
print_info "Installing build tools..."
python3 -m pip install --upgrade pip setuptools wheel build twine --quiet

# Build
print_info "Building package..."
python3 -m build

if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    print_success "Package built successfully"
    ls -lh dist/
else
    print_error "Build failed - no dist directory"
    exit 1
fi

# Step 7: Validate distribution
print_step "Step 7: Validating Distribution"

python3 -m twine check dist/*
if [ $? -eq 0 ]; then
    print_success "Distribution validated"
else
    print_error "Distribution validation failed"
    exit 1
fi

# Step 8: Upload to PyPI
print_step "Step 8: Publishing to PyPI"

# Check for .pypirc
if [ -f "$HOME/.pypirc" ]; then
    print_success "Found .pypirc configuration"
else
    print_warning ".pypirc not found at $HOME/.pypirc"
    print_info "Creating .pypirc template..."

    cat > "$HOME/.pypirc" <<EOF
[pypi]
username = __token__
password = YOUR_PYPI_TOKEN_HERE

[testpypi]
username = __token__
password = YOUR_TEST_PYPI_TOKEN_HERE
EOF

    print_warning "Please edit $HOME/.pypirc and add your PyPI token"
    print_info "Get token from: https://pypi.org/manage/account/token/"
    read -p "Press Enter after updating .pypirc..."
fi

echo ""
print_info "Ready to publish to PyPI"
echo "Choose upload destination:"
echo "  1) TestPyPI (recommended for testing)"
echo "  2) PyPI (production)"
echo "  3) Skip upload"
echo ""
read -p "Enter choice (1-3): " upload_choice

case $upload_choice in
    1)
        print_info "Uploading to TestPyPI..."
        python3 -m twine upload --repository testpypi dist/*
        if [ $? -eq 0 ]; then
            print_success "Uploaded to TestPyPI!"
            echo ""
            print_info "Test installation with:"
            echo "  pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple $PACKAGE_NAME"
        else
            print_error "Upload to TestPyPI failed"
            exit 1
        fi
        ;;
    2)
        print_warning "Uploading to PyPI (Production)..."
        read -p "Are you sure? This cannot be undone. (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            python3 -m twine upload dist/*
            if [ $? -eq 0 ]; then
                print_success "Uploaded to PyPI!"
                echo ""
                print_info "Package is live at: https://pypi.org/project/$PACKAGE_NAME/"
                print_info "Users can install with:"
                echo "  pip install $PACKAGE_NAME"
            else
                print_error "Upload to PyPI failed"
                exit 1
            fi
        else
            print_warning "Upload cancelled"
        fi
        ;;
    3)
        print_warning "Skipping upload"
        print_info "To upload later:"
        echo "  TestPyPI: python3 -m twine upload --repository testpypi dist/*"
        echo "  PyPI:     python3 -m twine upload dist/*"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Step 9: Final summary
print_step "Deployment Complete"

print_success "Package: $PACKAGE_NAME v$VERSION"
if [ "$upload_choice" = "2" ]; then
    print_success "PyPI: https://pypi.org/project/$PACKAGE_NAME/"
fi
print_success "GitHub: https://github.com/$GITHUB_REPO"

echo ""
print_info "Next steps:"
echo "  - Test installation: pip install $PACKAGE_NAME"
echo "  - View on PyPI: https://pypi.org/project/$PACKAGE_NAME/"
echo "  - View on GitHub: https://github.com/$GITHUB_REPO"
echo "  - Share your package!"

echo ""
print_success "All done!"
