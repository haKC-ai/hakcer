#!/bin/bash

# Automated GitHub Commit and PyPI Publishing Setup Script
# This script commits all necessary files to GitHub and sets up trusted publishing

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
print_step() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

REPO_OWNER="haKC-ai"
REPO_NAME="hakcer"
PYPI_OWNER="hakc-ai"  # PyPI uses lowercase without dash
GITHUB_REPO="$REPO_OWNER/$REPO_NAME"
VERSION="1.0.0"

print_step "haKCer GitHub Commit & Publish Setup"

# Step 1: Validate required files
print_step "Step 1: Validating Files for Commit"

REQUIRED_FILES=(
    "hakcer/__init__.py"
    "hakcer/banner.py"
    "hakcer/themes.py"
    "setup.py"
    "pyproject.toml"
    "README.md"
    "LICENSE"
    "MANIFEST.in"
    "requirements.txt"
    ".gitignore"
    ".github/workflows/publish.yml"
)

missing=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "Found: $file"
    else
        print_error "Missing: $file"
        missing=$((missing + 1))
    fi
done

if [ $missing -gt 0 ]; then
    print_error "$missing required file(s) missing!"
    exit 1
fi

print_success "All required files present"

# Step 2: Check GitHub CLI
print_step "Step 2: Checking GitHub CLI"

if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) not found"
    print_info "Install with: brew install gh"
    exit 1
fi

print_success "GitHub CLI found"

# Check authentication
if ! gh auth status &> /dev/null; then
    print_warning "GitHub CLI not authenticated"
    print_info "Authenticating with GitHub..."
    gh auth login
fi

print_success "GitHub CLI authenticated"

# Step 3: Initialize/Setup Git Repository
print_step "Step 3: Setting Up Git Repository"

if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    git branch -M main
    print_success "Git initialized"
else
    print_success "Git already initialized"
fi

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    print_success "Remote 'origin' already configured"
else
    print_info "Adding remote origin..."
    git remote add origin "https://github.com/$GITHUB_REPO.git"
    print_success "Remote added"
fi

# Step 4: Create GitHub Repository (if needed)
print_step "Step 4: Creating GitHub Repository"

if gh repo view "$GITHUB_REPO" &> /dev/null; then
    print_success "Repository already exists: $GITHUB_REPO"
else
    print_info "Creating repository: $GITHUB_REPO"
    gh repo create "$GITHUB_REPO" \
        --public \
        --description "Animated ASCII banner with terminal effects and customizable themes for CLI tools" \
        --source=. \
        --remote=origin

    if [ $? -eq 0 ]; then
        print_success "Repository created"
    else
        print_error "Failed to create repository"
        exit 1
    fi
fi

# Step 5: Commit Files
print_step "Step 5: Committing Files"

# Show what will be committed
print_info "Files to commit:"
git status --short

# Add all files
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    print_info "Committing changes..."
    git commit -m "Release v$VERSION: haKCer with 9 themes and automated publishing

- Added theme system with 9 themes (Tokyo Night, Cyberpunk, Neon, etc.)
- 23+ terminal effects
- GitHub Actions workflow for automated PyPI publishing
- Comprehensive documentation with shields.io badges and mermaid charts
- Examples and test suite included"

    print_success "Changes committed"
fi

# Step 6: Push to GitHub
print_step "Step 6: Pushing to GitHub"

# Check if remote has conflicting changes
print_info "Checking remote status..."
git fetch origin main 2>/dev/null || true

if git diff origin/main...HEAD --quiet 2>/dev/null; then
    print_info "Local and remote are in sync"
    git push -u origin main
    print_success "Pushed to GitHub"
else
    print_warning "Remote has different content (likely default README)"
    read -p "Force push and replace remote content? (yes/no): " force_push

    if [ "$force_push" = "yes" ]; then
        print_info "Force pushing to GitHub..."
        git push -u origin main --force
        print_success "Force pushed to GitHub (remote README replaced)"
    else
        print_info "Attempting normal push..."
        git push -u origin main
        if [ $? -eq 0 ]; then
            print_success "Pushed to GitHub"
        else
            print_error "Push failed. Run manually: git push -u origin main --force"
            exit 1
        fi
    fi
fi

# Step 7: Create and Push Tag
print_step "Step 7: Creating Version Tag"

if git rev-parse "v$VERSION" >/dev/null 2>&1; then
    print_warning "Tag v$VERSION already exists"
else
    print_info "Creating tag v$VERSION..."
    git tag -a "v$VERSION" -m "Release v$VERSION"
    git push origin "v$VERSION"
    print_success "Tag created and pushed"
fi

# Step 8: Setup GitHub Environment for PyPI
print_step "Step 8: Setting Up GitHub Environment"

print_info "Creating 'pypi' environment with deployment protection..."

# Note: This requires manual setup in GitHub UI for now
# gh api does not fully support environment creation with all options yet

print_warning "MANUAL STEP REQUIRED:"
echo ""
echo "1. Go to: https://github.com/$GITHUB_REPO/settings/environments"
echo "2. Click 'New environment'"
echo "3. Name it: pypi"
echo "4. Add deployment protection rules (recommended)"
echo "5. Click 'Configure environment'"
echo ""
print_info "Press Enter when environment is created..."
read -r

# Step 9: PyPI Trusted Publisher Configuration
print_step "Step 9: PyPI Trusted Publisher Setup"

print_info "Configuring PyPI Trusted Publisher..."
echo ""
print_warning "MANUAL STEP REQUIRED:"
echo ""
echo "Go to: https://pypi.org/manage/account/publishing/"
echo ""
echo "Add a new pending publisher with these details:"
echo ""
echo "  PyPI Project Name:    hakcer"
echo "  Owner:                $PYPI_OWNER"
echo "  Repository name:      $REPO_NAME"
echo "  Workflow name:        workflow.yml"
echo "  Environment name:     pypi"
echo ""
print_info "Press Enter when publisher is configured..."
read -r

# Step 10: Verify Setup
print_step "Step 10: Verifying Setup"

print_info "Verifying GitHub repository..."
if gh repo view "$GITHUB_REPO" &> /dev/null; then
    print_success "Repository accessible: https://github.com/$GITHUB_REPO"
else
    print_error "Cannot access repository"
    exit 1
fi

print_info "Verifying workflow file..."
if gh api "repos/$GITHUB_REPO/contents/.github/workflows/publish.yml" &> /dev/null; then
    print_success "Workflow file found on GitHub"
else
    print_warning "Workflow file not found (may need time to sync)"
fi

# Step 11: Summary and Next Steps
print_step "Deployment Setup Complete"

print_success "Repository: https://github.com/$GITHUB_REPO"
print_success "Version: v$VERSION"
print_success "Workflow: .github/workflows/publish.yml"

echo ""
print_info "===== NEXT STEPS ====="
echo ""
echo "1. VERIFY GITHUB ENVIRONMENT (if not done):"
echo "   https://github.com/$GITHUB_REPO/settings/environments"
echo "   - Should have 'pypi' environment"
echo ""
echo "2. VERIFY PYPI TRUSTED PUBLISHER (if not done):"
echo "   https://pypi.org/manage/account/publishing/"
echo "   - Add pending publisher for 'hakcer'"
echo "   - Owner: $PYPI_OWNER"
echo "   - Repo: $REPO_NAME"
echo "   - Workflow: workflow.yml"
echo "   - Environment: pypi"
echo ""
echo "3. TEST THE WORKFLOW:"
echo "   Push a new tag to trigger publishing:"
echo "   $ git tag -a v1.0.1 -m 'Test release'"
echo "   $ git push origin v1.0.1"
echo ""
echo "   Or manually trigger:"
echo "   $ gh workflow run publish.yml"
echo ""
echo "4. MONITOR THE WORKFLOW:"
echo "   https://github.com/$GITHUB_REPO/actions"
echo ""
echo "5. AFTER FIRST SUCCESSFUL PUBLISH:"
echo "   Check PyPI: https://pypi.org/project/hakcer/"
echo ""

print_success "All automated steps complete!"
print_info "Complete manual steps above, then push a tag to publish"
