# Upload Version 1.0.1 (Clean README)

Version 1.0.1 is built with the clean README (no emojis).

## To Upload

You need to set up your PyPI token first, then upload.

### Option 1: Use Environment Variables

```bash
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=your-pypi-token-here
python3 -m twine upload dist/*
```

### Option 2: Create ~/.pypirc

Create file `~/.pypirc`:
```ini
[pypi]
username = __token__
password = your-pypi-token-here
```

Then upload:
```bash
python3 -m twine upload dist/*
```

### Option 3: Use the Script

```bash
./setup_pypi_token.sh
./upload_now.sh
```

## After Upload

The PyPI page will update with the new README (without emojis) in a few minutes.

Visit: https://pypi.org/project/hakcer/

## Update GitHub Too

```bash
git add .
git commit -m "Release v1.0.1: Remove emojis from PyPI README"
git push
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```
