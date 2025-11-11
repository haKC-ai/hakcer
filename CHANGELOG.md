# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-10

### Added
- Initial release of haKCer package
- 23+ terminal text effects powered by terminaltexteffects
- 9 built-in themes:
  - Synthwave (default)
  - Tokyo Night
  - Tokyo Night Storm
  - Neon
  - Cyberpunk
  - Matrix
  - Dracula
  - Nord
  - Gruvbox
- Speed categories for effects (fast, medium, slow)
- Theme management API (`set_theme()`, `list_themes()`, `get_current_theme()`)
- Effect management API (`show_banner()`, `list_effects()`, `get_effects_by_speed()`)
- Comprehensive documentation and examples
- PyPI package distribution
- MIT License

### Features
- Zero-configuration default setup
- Customizable animation hold time
- Optional terminal clearing after animation
- Smart effect selection based on speed preference
- Full theme customization support
- Compatible with Python 3.8+

### Documentation
- Complete README with usage examples
- CONTRIBUTING.md for developers
- PYPI_SETUP_GUIDE.md for publishing
- examples.py with 10 usage examples
- Comprehensive API reference

---

## Future Releases

See [GitHub Issues](https://github.com/haKC-ai/hakcer/issues) for planned features and enhancements.

### Planned Features
- Custom ASCII art support
- Configuration file support (.hakcer.toml)
- More themes (Monokai, One Dark, etc.)
- Animation speed control
- Sound effects (optional)
- Theme previews in terminal
- CLI tool for testing themes

---

## Release Process

1. Update version in:
   - `hakcer/__init__.py`
   - `setup.py`
   - `pyproject.toml`
2. Update CHANGELOG.md
3. Create git tag: `git tag -a v1.0.0 -m "Release v1.0.0"`
4. Push tag: `git push origin v1.0.0`
5. Run: `./publish_to_pypi.sh`
6. Create GitHub release with notes

---

[1.0.0]: https://github.com/haKC-ai/hakcer/releases/tag/v1.0.0
