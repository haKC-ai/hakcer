# haKCer - Quick Start Guide

## 🚀 3-Step Publishing Process

### Step 1: Test Locally (5 minutes)
```bash
# Install dependencies
pip install terminaltexteffects rich

# Test imports
python3 -c "from hakcer import show_banner, set_theme; print('✓ Works!')"

# Run full tests
python3 test_package.py

# Try some examples
python3 examples.py 1  # Basic usage
python3 examples.py 2  # Theme showcase
```

### Step 2: Push to GitHub (2 minutes)
```bash
# Initialize git repository
git init

# Add all files (do_not_commit/ is automatically excluded)
git add .

# Make first commit
git commit -m "Initial release: haKCer v1.0.0 with 9 themes"

# Add GitHub remote
git remote add origin https://github.com/haKC-ai/hakcer.git

# Push to GitHub
git push -u origin main
```

### Step 3: Publish to PyPI (5 minutes)
```bash
# Run the automated publishing script
./publish_to_pypi.sh

# Choose option 1 (TestPyPI) for testing first
# Then run again and choose option 2 (PyPI) for production
```

## 📋 Pre-Publishing Checklist

- [x] Package structure created
- [x] 9 themes implemented
- [x] 23+ effects supported
- [x] Documentation complete
- [x] Examples provided
- [x] Test suite created
- [x] License added (MIT)
- [x] .gitignore configured
- [x] GitHub repo info updated
- [x] Email updated to cory@haKC.ai

**You just need to**:
- [ ] Test the package locally
- [ ] Create PyPI account
- [ ] Run publish script
- [ ] Share with the world!

## 🎨 Quick Theme Test

Try all themes quickly:

```bash
python3 -c "
from hakcer import show_banner, set_theme, list_themes
import time

for theme in list_themes():
    print(f'\n🎨 {theme.upper()}')
    set_theme(theme)
    show_banner(effect_name='slide', hold_time=1.0)
    time.sleep(0.5)
"
```

## 📦 PyPI Account Setup

### 1. Create Account
- Production PyPI: https://pypi.org/account/register/
- Test PyPI: https://test.pypi.org/account/register/

### 2. Generate API Token
- Go to: https://pypi.org/manage/account/
- Click "Add API token"
- Name it: "hakcer-upload"
- Copy the token (starts with `pypi-`)

### 3. Create ~/.pypirc
```ini
[pypi]
username = __token__
password = pypi-YOUR_TOKEN_HERE

[testpypi]
username = __token__
password = pypi-YOUR_TEST_TOKEN_HERE
```

## 🧪 Test Installation After Publishing

### From TestPyPI
```bash
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer

python3 -c "from hakcer import show_banner; show_banner()"
```

### From PyPI (Production)
```bash
pip install hakcer

python3 -c "from hakcer import show_banner, set_theme; set_theme('cyberpunk'); show_banner()"
```

## 📁 What Gets Published

✅ **Included in package**:
- `hakcer/` directory (all Python files)
- `README_PYPI.md` (as package description)
- `LICENSE`
- `requirements.txt`
- Package metadata (setup.py, pyproject.toml)

❌ **Excluded from package**:
- `do_not_commit/` directory
- `examples.py` (stays on GitHub)
- `test_package.py` (stays on GitHub)
- Documentation files (GitHub only)
- `.git/` directory

## 🎯 After Publishing

### 1. Verify Package
Visit: https://pypi.org/project/hakcer/

### 2. Test Installation
```bash
# In a fresh environment
python3 -m venv test_env
source test_env/bin/activate  # On Windows: test_env\Scripts\activate
pip install hakcer
python3 -c "from hakcer import show_banner; show_banner()"
deactivate
```

### 3. Update GitHub README
Add PyPI badge (update version as needed):
```markdown
[![PyPI version](https://badge.fury.io/py/hakcer.svg)](https://badge.fury.io/py/hakcer)
```

### 4. Share Your Package
- Post on Reddit: r/Python, r/programming
- Tweet with #Python #CLI
- Add to awesome-python lists
- Share on LinkedIn
- Post on Dev.to

## 🔄 Future Updates

To release version 1.0.1 (or any update):

```bash
# 1. Update version in 3 files
# - hakcer/__init__.py: __version__ = "1.0.1"
# - setup.py: version="1.0.1"
# - pyproject.toml: version = "1.0.1"

# 2. Update CHANGELOG.md
# Add new version section with changes

# 3. Commit and tag
git add .
git commit -m "Release v1.0.1: [describe changes]"
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin main --tags

# 4. Publish
./publish_to_pypi.sh
```

## ❓ Common Questions

**Q: Can I change the package name later?**
A: No, PyPI package names are permanent. Choose wisely.

**Q: Can I delete a version?**
A: No, but you can "yank" it to hide from new installs.

**Q: How do I add new themes?**
A: Edit `hakcer/themes.py`, add to `THEMES` dict, update version, republish.

**Q: What if someone already took the name?**
A: Try: `pip install hakcer` - if it fails, the name is available!

**Q: Do I need to publish every change?**
A: No, only publish when you want users to get the update.

## 🆘 Need Help?

1. Read: [GETTING_STARTED.md](GETTING_STARTED.md)
2. Read: [PYPI_SETUP_GUIDE.md](PYPI_SETUP_GUIDE.md)
3. Check: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
4. Email: cory@haKC.ai

## ✨ Ready? Let's Go!

```bash
# Test it
python3 test_package.py

# Publish it
./publish_to_pypi.sh

# Share it
# Post on social media, Reddit, etc.
```

**Good luck! 🚀**

---

**Made with ⚡ by haKCer | The Pinnacle of Hakcing Quality**
