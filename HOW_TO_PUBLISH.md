# How to Publish haKCer to PyPI

Your repository is now clean and ready. Here's how to publish:

## Current Status

**GitHub Repository**: Clean and ready
- URL: https://github.com/haKC-ai/hakcer
- Only essential files committed
- Workflow file in place

**Package**: Built and validated
- Files in `dist/` directory ready to upload

## Option 1: Manual Upload to PyPI (Quickest)

```bash
cd "/Users/0xdeadbeef/Downloads/files (7)"
python3 -m twine upload dist/*
```

Enter your PyPI credentials when prompted.

## Option 2: Use GitHub Actions (Automated)

### Step 1: Set up PyPI Trusted Publisher

1. Go to: https://pypi.org/manage/account/publishing/
2. Click "Add a new pending publisher"
3. Fill in:
   - **PyPI Project Name**: `hakcer`
   - **Owner**: `hakc-ai`
   - **Repository name**: `hakcer`
   - **Workflow name**: `workflow.yml`
   - **Environment name**: `pypi`
4. Click "Add"

### Step 2: Create GitHub Environment

1. Go to: https://github.com/haKC-ai/hakcer/settings/environments
2. Click "New environment"
3. Name: `pypi`
4. Save

### Step 3: Push a Tag

```bash
cd "/Users/0xdeadbeef/Downloads/files (7)"
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

The workflow will automatically build and publish to PyPI.

## What's in the Clean Repository

**Essential Files Only:**
- `hakcer/` - Package code
- `.github/workflows/` - CI/CD
- `setup.py`, `pyproject.toml` - Config
- `README.md` - Documentation
- `LICENSE`, `requirements.txt`
- `CHANGELOG.md`, `CONTRIBUTING.md`
- `examples.py`, `test_package.py`

**Not in Repository** (ignored):
- Build artifacts
- Script files
- Extra documentation
- Reference files

## After Publishing

### Verify

Check PyPI: https://pypi.org/project/hakcer/

### Test Installation

```bash
pip install hakcer
python3 -c "from hakcer import show_banner, set_theme; set_theme('tokyo_night'); show_banner()"
```

## Monitoring

**GitHub Actions**: https://github.com/haKC-ai/hakcer/actions
**PyPI Stats**: https://pypistats.org/packages/hakcer

---

**Recommendation**: Use Option 1 (manual upload) for first release, then set up Option 2 for future automated releases.
