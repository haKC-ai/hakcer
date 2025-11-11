# haKCer Deployment Guide

## Package is Built and Ready to Publish!

Your haKCer package has been successfully built and is ready to upload to PyPI.

### Build Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)
![Package Size](https://img.shields.io/badge/package-11KB-blue?style=flat-square)
![Validation](https://img.shields.io/badge/validation-passed-success?style=flat-square)

**Distribution files created:**
- `hakcer-1.0.0-py3-none-any.whl` (11KB) - Wheel distribution
- `hakcer-1.0.0.tar.gz` (15KB) - Source distribution

Both files have been validated and are ready for upload.

## Quick Upload to PyPI

### Option 1: Upload to Production PyPI (Recommended)

```bash
./upload_to_pypi.sh
# Choose option 1
```

Or manually:
```bash
python3 -m twine upload dist/*
```

### Option 2: Test on TestPyPI First

```bash
./upload_to_pypi.sh
# Choose option 2
```

Or manually:
```bash
python3 -m twine upload --repository testpypi dist/*
```

## Prerequisites

### 1. PyPI Account Setup

If you haven't already:
1. Create account: https://pypi.org/account/register/
2. Generate API token: https://pypi.org/manage/account/token/
3. Copy token (starts with `pypi-`)

### 2. Configure ~/.pypirc

Create or update `~/.pypirc`:

```ini
[pypi]
username = __token__
password = pypi-YOUR_TOKEN_HERE

[testpypi]
username = __token__
password = pypi-YOUR_TEST_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with your actual PyPI token.

## Upload Process

### Step-by-Step

1. **Verify Package is Built**
   ```bash
   ls -lh dist/
   ```
   You should see:
   - `hakcer-1.0.0-py3-none-any.whl`
   - `hakcer-1.0.0.tar.gz`

2. **Run Upload Script**
   ```bash
   ./upload_to_pypi.sh
   ```

3. **Choose Destination**
   - Option 1: PyPI (production) - Package goes live immediately
   - Option 2: TestPyPI (testing) - Safe testing environment

4. **Enter Credentials**
   - If `~/.pypirc` is configured, it will use your token automatically
   - Otherwise, you'll be prompted for username (`__token__`) and password (your token)

5. **Wait for Upload**
   - Upload typically takes 10-30 seconds
   - You'll see progress bars for each file

6. **Verification**
   - Production: https://pypi.org/project/hakcer/
   - TestPyPI: https://test.pypi.org/project/hakcer/

## After Upload

### Verify Installation

**From PyPI:**
```bash
pip install hakcer
python3 -c "from hakcer import show_banner, set_theme; set_theme('tokyo_night'); show_banner()"
```

**From TestPyPI:**
```bash
pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer
python3 -c "from hakcer import show_banner; show_banner()"
```

### Update GitHub

Push your code to GitHub:

```bash
# If not already initialized
git init
git branch -M main

# Add all files
git add .
git commit -m "Release v1.0.0: haKCer with theme support"

# Add remote and push
git remote add origin https://github.com/haKC-ai/hakcer.git
git push -u origin main

# Tag the release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Or use GitHub CLI:

```bash
gh repo create haKC-ai/hakcer --public --source=. --description="Animated ASCII banner with terminal effects and customizable themes"
git push -u origin main
```

## Files Included in Package

The following files are bundled in the distribution:

```
hakcer-1.0.0/
├── hakcer/
│   ├── __init__.py      - Package initialization
│   ├── banner.py        - Banner display logic
│   └── themes.py        - Theme definitions
├── LICENSE              - MIT License
├── README_PYPI.md       - Package description
├── requirements.txt     - Dependencies
├── pyproject.toml       - Package metadata
└── setup.py            - Setup configuration
```

## Package Metadata

- **Name**: hakcer
- **Version**: 1.0.0
- **Author**: haKCer
- **Email**: cory@haKC.ai
- **License**: MIT
- **Python**: >=3.8
- **Dependencies**:
  - terminaltexteffects>=0.11.0
  - rich>=13.0.0

## Troubleshooting

### "Invalid or non-existent authentication information"

Fix your `~/.pypirc` file:
```ini
[pypi]
username = __token__
password = pypi-YOUR_ACTUAL_TOKEN_HERE
```

Make sure to use `__token__` as username (with double underscores) and your full token as password.

### "File already exists"

This version (1.0.0) is already uploaded. You need to:
1. Update version in `hakcer/__init__.py`, `setup.py`, and `pyproject.toml`
2. Rebuild: `./build_package.sh`
3. Upload again: `./upload_to_pypi.sh`

### "Package name already taken"

The name `hakcer` is already registered by someone else. You would need to:
1. Choose a different name
2. Update package name in all files
3. Rebuild and upload

### Build Errors

If you need to rebuild:
```bash
# Clean everything
rm -rf build/ dist/ *.egg-info

# Rebuild
./build_package.sh
```

## Next Steps After Publishing

1. **Verify on PyPI**
   - Visit: https://pypi.org/project/hakcer/
   - Check description renders correctly
   - Verify version and metadata

2. **Test Installation**
   ```bash
   # In a fresh virtual environment
   python3 -m venv test_env
   source test_env/bin/activate
   pip install hakcer
   python3 -c "from hakcer import show_banner; show_banner()"
   deactivate
   ```

3. **Update README Badges**
   Your GitHub README already has shields.io badges that will update automatically:
   - PyPI version badge
   - Downloads badge
   - Python version badge

4. **Announce Your Package**
   - Twitter/X with #Python hashtag
   - Reddit: r/Python, r/programming
   - Hacker News
   - Dev.to article
   - LinkedIn post

5. **Monitor**
   - PyPI stats: https://pypistats.org/packages/hakcer
   - GitHub issues: https://github.com/haKC-ai/hakcer/issues
   - Downloads and stars

## Scripts Available

| Script | Purpose |
|--------|---------|
| `build_package.sh` | Build distribution files |
| `upload_to_pypi.sh` | Upload to PyPI (interactive) |
| `deploy.sh` | Full automated deployment (git + PyPI) |
| `test_package.py` | Run package tests |
| `examples.py` | Usage examples |

## Support

- **Issues**: https://github.com/haKC-ai/hakcer/issues
- **Email**: cory@haKC.ai
- **PyPI**: https://pypi.org/project/hakcer/

---

**Your package is ready to go! Run `./upload_to_pypi.sh` to publish.**
