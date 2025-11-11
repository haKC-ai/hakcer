# Getting Started with haKCer

Welcome! This guide will help you get your haKCer package set up and published to PyPI.

## 📦 Package Structure

Your package is now organized and ready to publish:

```
hakcer/
├── hakcer/                      # Main package directory
│   ├── __init__.py             # Package initialization and exports
│   ├── banner.py               # Banner display logic with effects
│   └── themes.py               # Theme definitions (9 themes included)
├── setup.py                    # Package setup configuration
├── pyproject.toml              # Modern Python project config
├── requirements.txt            # Package dependencies
├── LICENSE                     # MIT License
├── MANIFEST.in                 # Files to include in distribution
├── README.md                   # GitHub README
├── README_PYPI.md             # PyPI-specific README
├── CHANGELOG.md               # Version history
├── CONTRIBUTING.md            # Contribution guidelines
├── .gitignore                 # Git ignore rules
├── publish_to_pypi.sh         # Automated publishing script
├── PYPI_SETUP_GUIDE.md        # Detailed publishing guide
├── test_package.py            # Test suite
├── examples.py                # Usage examples
└── do_not_commit/             # Reference files (not for repo)
    ├── banner.py              # Original banner module
    ├── example_app.py         # Original example
    └── ...                    # Other reference files
```

## 🚀 Quick Start (3 Steps)

### Step 1: Test Locally

```bash
# Install in development mode
pip install -e .

# Run tests
python test_package.py

# Try examples
python examples.py 1
```

### Step 2: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files (do_not_commit is in .gitignore)
git add .

# Make initial commit
git commit -m "Initial release of haKCer v1.0.0"

# Add your GitHub remote
git remote add origin https://github.com/haKC-ai/hakcer.git

# Push to GitHub
git push -u origin main
```

### Step 3: Publish to PyPI

```bash
# Run the automated script
./publish_to_pypi.sh

# Follow the prompts to:
# 1. Build the package
# 2. Test on TestPyPI (recommended first)
# 3. Publish to PyPI (production)
```

## 🔑 PyPI Setup

Before publishing, you need a PyPI account:

1. **Create PyPI account**: https://pypi.org/account/register/
2. **Create TestPyPI account**: https://test.pypi.org/account/register/
3. **Generate API token**:
   - Go to https://pypi.org/manage/account/
   - Scroll to "API tokens"
   - Click "Add API token"
   - Copy the token (starts with `pypi-`)

4. **Create `~/.pypirc`**:
   ```ini
   [pypi]
   username = __token__
   password = pypi-YOUR_TOKEN_HERE

   [testpypi]
   username = __token__
   password = pypi-YOUR_TEST_TOKEN_HERE
   ```

## 📝 What's Included

### 9 Themes
- **synthwave**: Classic cyan/magenta/purple (default)
- **tokyo_night**: Dark blue Tokyo aesthetic
- **tokyo_night_storm**: Brighter Tokyo Night variant
- **neon**: Bright electric colors
- **cyberpunk**: Yellow/pink Cyberpunk 2077 style
- **matrix**: Classic green matrix
- **dracula**: Purple/pink Dracula theme
- **nord**: Arctic blue color palette
- **gruvbox**: Retro warm colors

### 23+ Effects
- **Fast** (10): decrypt, expand, print, slide, wipe, colorshift, scattered, randomsequence, pour, errorcorrect
- **Medium** (10): beams, binarypath, burn, crumble, overflow, rain, spray, unstable, vhstape, waves
- **Slow** (9): blackhole, bouncyballs, fireworks, matrix, orbittingvolley, rings, spotlights, swarm, synthgrid

### Features
- Zero-config defaults
- Speed-based effect selection
- Theme customization
- Production-ready
- Python 3.8+ support
- Cross-platform (macOS, Linux, Windows)

## 🧪 Testing Before Publishing

### 1. Test Imports
```bash
python -c "from hakcer import show_banner, set_theme, list_themes; print('✓ Imports work')"
```

### 2. Test All Themes
```bash
python -c "from hakcer import *; [show_banner(theme=t, effect_name='slide', hold_time=0.5) for t in list_themes()]"
```

### 3. Run Full Test Suite
```bash
python test_package.py
```

### 4. Test Examples
```bash
python examples.py 7  # List all features
python examples.py 2  # Show theme showcase
```

## 📤 Publishing Workflow

### First Time (TestPyPI)

```bash
# 1. Run publish script
./publish_to_pypi.sh

# 2. Choose option 1 (TestPyPI)
# 3. Enter credentials when prompted

# 4. Test installation from TestPyPI
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer

# 5. Verify it works
python -c "from hakcer import show_banner; show_banner()"
```

### Production (PyPI)

```bash
# 1. Run publish script again
./publish_to_pypi.sh

# 2. Choose option 2 (PyPI)
# 3. Confirm upload

# 4. Test installation
pip install hakcer

# 5. Verify
python -c "from hakcer import show_banner; show_banner()"
```

## 🔄 Updating the Package

When you want to release a new version:

1. **Update version numbers** in:
   - `hakcer/__init__.py` → `__version__ = "1.0.1"`
   - `setup.py` → `version="1.0.1"`
   - `pyproject.toml` → `version = "1.0.1"`

2. **Update CHANGELOG.md** with changes

3. **Commit and tag**:
   ```bash
   git add .
   git commit -m "Release v1.0.1"
   git tag -a v1.0.1 -m "Release v1.0.1"
   git push origin main --tags
   ```

4. **Publish**:
   ```bash
   ./publish_to_pypi.sh
   ```

## 📚 Documentation

- **README.md**: GitHub repository documentation
- **README_PYPI.md**: PyPI package description
- **CONTRIBUTING.md**: How to contribute
- **PYPI_SETUP_GUIDE.md**: Detailed publishing guide
- **CHANGELOG.md**: Version history

## 🐛 Common Issues

### "Package already exists"
- You've already uploaded this version
- Increment version number and rebuild

### "Invalid credentials"
- Check `~/.pypirc` file
- Verify API token is correct

### Import errors
- Make sure dependencies are installed: `pip install terminaltexteffects rich`
- Check that `hakcer/__init__.py` exports correctly

### Build fails
```bash
# Clean and rebuild
rm -rf build/ dist/ *.egg-info
python -m build
```

## 🎯 Next Steps

After publishing:

1. ✅ Verify package on PyPI: https://pypi.org/project/hakcer/
2. ✅ Test installation: `pip install hakcer`
3. ✅ Add PyPI badge to README
4. ✅ Share with the community
5. ✅ Monitor for issues: https://github.com/haKC-ai/hakcer/issues

## 🤝 Support

- **Issues**: https://github.com/haKC-ai/hakcer/issues
- **Email**: cory@haKC.ai
- **PyPI**: https://pypi.org/project/hakcer/

## 🎉 You're Ready!

Your package is ready to publish. Run `./publish_to_pypi.sh` and follow the prompts!

---

**Made with ⚡ by haKCer | The Pinnacle of Hakcing Quality**
