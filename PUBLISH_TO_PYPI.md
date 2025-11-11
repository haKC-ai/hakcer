# Publish to PyPI - Simple Instructions

## Step 1: Setup Your PyPI Token (One Time)

Run this script and paste your PyPI token when prompted:

```bash
./setup_pypi_token.sh
```

Your token should start with `pypi-` and can be obtained from:
https://pypi.org/manage/account/token/

This creates `~/.pypirc` with your credentials.

## Step 2: Upload to PyPI

```bash
./upload_now.sh
```

This will:
- Upload both distribution files to PyPI
- Create and push git tag v1.0.0
- Display success message with package URL

## That's It!

After upload completes, your package will be live at:
https://pypi.org/project/hakcer/

Anyone can install it with:
```bash
pip install hakcer
```

## Test Your Package

```bash
# In a fresh terminal or virtual environment
pip install hakcer

# Test it
python3 -c "from hakcer import show_banner, set_theme; set_theme('tokyo_night'); show_banner()"
```

## If You Need to Update

1. Update version in:
   - `hakcer/__init__.py`
   - `setup.py`
   - `pyproject.toml`

2. Rebuild:
   ```bash
   rm -rf dist/ build/ *.egg-info
   python3 -m build
   ```

3. Upload:
   ```bash
   ./upload_now.sh
   ```

---

**Ready to publish? Run `./setup_pypi_token.sh` then `./upload_now.sh`**
