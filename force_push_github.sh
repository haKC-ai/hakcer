#!/bin/bash

# Force push to GitHub, replacing any existing content
# Use this if the remote has a default README you want to replace

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }

GITHUB_REPO="haKC-ai/hakcer"

echo ""
echo "======================================"
echo "Force Push to GitHub"
echo "======================================"
echo ""

print_warning "This will REPLACE all content on GitHub with your local files"
print_info "Remote: https://github.com/$GITHUB_REPO"
echo ""
read -p "Are you sure? Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
    print_info "Cancelled"
    exit 0
fi

echo ""
print_info "Step 1: Checking git status..."
if [ ! -d ".git" ]; then
    print_info "Initializing git..."
    git init
    git branch -M main
fi

print_info "Step 2: Adding remote..."
if ! git remote get-url origin &> /dev/null; then
    git remote add origin "https://github.com/$GITHUB_REPO.git"
    print_success "Remote added"
else
    print_success "Remote already exists"
fi

print_info "Step 3: Staging all files..."
git add .

print_info "Step 4: Committing..."
if git diff --staged --quiet; then
    print_info "No changes to commit"
else
    git commit -m "Replace remote content with local haKCer package

- Full package with 9 themes
- GitHub Actions workflow
- Complete documentation
- Examples and tests"
    print_success "Committed"
fi

print_info "Step 5: Force pushing to GitHub..."
git push -u origin main --force

if [ $? -eq 0 ]; then
    echo ""
    print_success "Successfully force pushed to GitHub!"
    print_success "Repository: https://github.com/$GITHUB_REPO"
    echo ""
    print_info "Next step: Create version tag"
    echo "  git tag -a v1.0.0 -m 'Release v1.0.0'"
    echo "  git push origin v1.0.0"
else
    echo ""
    print_warning "Push failed. You may need to authenticate:"
    echo "  gh auth login"
    echo ""
    echo "Then try again:"
    echo "  ./force_push_github.sh"
fi

echo ""
