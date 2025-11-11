# haKCer - Complete PyPI Publishing Guide

This guide walks you through publishing your haKCer package to PyPI.

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **PyPI Account** - Register at https://pypi.org/account/register/
3. **TestPyPI Account** (optional but recommended) - Register at https://test.pypi.org/account/register/

## 🔑 Setup PyPI Authentication

### Option 1: API Tokens (Recommended)

1. Log into PyPI: https://pypi.org/manage/account/
2. Scroll to "API tokens" section
3. Click "Add API token"
4. Name it (e.g., "hakcer-upload")
5. Copy the token (starts with `pypi-`)

Create `~/.pypirc` file:

```ini
[pypi]
username = __token__
password = pypi-YOUR_TOKEN_HERE

[testpypi]
username = __token__
password = pypi-YOUR_TEST_TOKEN_HERE
```

### Option 2: Username/Password

You'll be prompted when uploading. Not recommended for security reasons.

## 🚀 Publishing Steps

### Step 1: Test Locally First

```bash
# Install in development mode
pip install -e .

# Test imports
python3 -c "from hakcer import show_banner, set_theme; set_theme('tokyo_night'); show_banner()"

# Test different themes
python3 -c "from hakcer import list_themes; print(list_themes())"
```

### Step 2: Run the Automated Script

```bash
./publish_to_pypi.sh
```

The script will:
1. ✓ Verify directory structure
2. ✓ Check Python version
3. ✓ Install/upgrade build tools
4. ✓ Clean previous builds
5. ✓ Run basic tests
6. ✓ Build the package
7. ✓ Check distribution validity
8. ✓ Show package contents
9. ✓ Prompt for upload destination

### Step 3: Choose Upload Destination

When prompted, choose:

**Option 1 - TestPyPI** (Recommended for first time)
- Safe testing environment
- Won't affect production PyPI
- Can test installation process

**Option 2 - PyPI** (Production)
- Real PyPI index
- Available to all pip users
- Permanent (can't delete releases)

**Option 3 - Skip**
- Just build the package
- Upload manually later

## 🧪 Testing Your Package

### After Uploading to TestPyPI:

```bash
# Install from TestPyPI
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer

# Test it
python3 -c "from hakcer import show_banner, set_theme; set_theme('cyberpunk'); show_banner()"
```

### After Uploading to PyPI:

```bash
# Install from PyPI
pip install hakcer

# Test it
python3 -c "from hakcer import show_banner; show_banner()"
```

## 📦 Manual Publishing (Alternative)

If you prefer to run commands manually:

```bash
# 1. Install build tools
pip install --upgrade pip setuptools wheel build twine

# 2. Clean previous builds
rm -rf build/ dist/ *.egg-info

# 3. Build package
python3 -m build

# 4. Check package
python3 -m twine check dist/*

# 5a. Upload to TestPyPI
python3 -m twine upload --repository testpypi dist/*

# 5b. OR upload to PyPI
python3 -m twine upload dist/*
```

## 🔄 Updating Your Package

To release a new version:

1. **Update version number** in:
   - `hakcer/__init__.py` (`__version__`)
   - `setup.py` (`version`)
   - `pyproject.toml` (`version`)

2. **Update CHANGELOG** (create if needed)

3. **Clean and rebuild**:
   ```bash
   rm -rf build/ dist/ *.egg-info
   ./publish_to_pypi.sh
   ```

4. **Tag the release** (optional but recommended):
   ```bash
   git tag -a v1.0.1 -m "Release version 1.0.1"
   git push origin v1.0.1
   ```

## ⚠️ Important Notes

### Version Numbers
- Use semantic versioning: MAJOR.MINOR.PATCH
- Example: 1.0.0, 1.0.1, 1.1.0, 2.0.0
- Can't reuse version numbers on PyPI

### Package Name
- `hakcer` is available on PyPI (as of this guide)
- Package names are case-insensitive
- Can't include underscores that look like dashes

### File Checklist
Make sure these files exist before publishing:
- ✓ `hakcer/__init__.py`
- ✓ `hakcer/banner.py`
- ✓ `hakcer/themes.py`
- ✓ `setup.py`
- ✓ `pyproject.toml`
- ✓ `README_PYPI.md`
- ✓ `LICENSE`
- ✓ `MANIFEST.in`
- ✓ `requirements.txt`

## 🐛 Troubleshooting

### "Package already exists"
- You've already uploaded this version
- Increment version number and rebuild

### "Invalid credentials"
- Check your `~/.pypirc` file
- Verify API token is correct
- Make sure token has upload permissions

### "File not found" errors during build
- Check MANIFEST.in includes all necessary files
- Verify all imports work locally first

### Import errors after installation
- Check that `hakcer/__init__.py` exports correctly
- Verify all dependencies are in `requirements.txt`

### Build fails
```bash
# Clean everything and try again
rm -rf build/ dist/ *.egg-info hakcer.egg-info
pip install --upgrade build setuptools wheel
python3 -m build
```

## 📊 Post-Publishing

After successful publish:

1. **Check PyPI page**: https://pypi.org/project/hakcer/
2. **Test installation** on fresh machine/virtualenv
3. **Update GitHub** with installation instructions
4. **Add PyPI badge** to README:
   ```markdown
   [![PyPI version](https://badge.fury.io/py/hakcer.svg)](https://badge.fury.io/py/hakcer)
   ```

## 🎯 Quick Commands Reference

```bash
# Build package
python3 -m build

# Check package
python3 -m twine check dist/*

# Upload to TestPyPI
python3 -m twine upload --repository testpypi dist/*

# Upload to PyPI
python3 -m twine upload dist/*

# Install from TestPyPI
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer

# Install from PyPI
pip install hakcer

# Test installation
python3 -c "from hakcer import show_banner, list_themes; print(list_themes()); show_banner()"
```

## 📈 Monitoring Your Package

- **PyPI Stats**: https://pypistats.org/packages/hakcer
- **Download Stats**: Check PyPI project page
- **Issues**: Monitor GitHub issues (if you set up repo)

## 🎓 Resources

- **Python Packaging Guide**: https://packaging.python.org/
- **PyPI Help**: https://pypi.org/help/
- **Twine Documentation**: https://twine.readthedocs.io/
- **TestPyPI**: https://test.pypi.org/

---

**Ready to publish?** Run `./publish_to_pypi.sh` and follow the prompts!
