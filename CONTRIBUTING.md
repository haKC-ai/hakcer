# Contributing to haKCer

Thank you for your interest in contributing to haKCer! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## 🛠️ Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/hakcer.git
cd hakcer

# Install in development mode
pip install -e .

# Install development dependencies
pip install -e ".[dev]"

# Run tests
python test_package.py
```

## 📝 Areas for Contribution

### 1. New Themes

Add new color themes to `hakcer/themes.py`:

```python
THEMES = {
    # ... existing themes ...
    "your_theme_name": {
        "name": "Your Theme Name",
        "description": "Brief description of the theme",
        "colors": {
            "primary": ["color1", "color2", "color3"],
            "accent": ["color4", "color5"],
            "error": ["error_color"],
            "gradient_stops": ["color1", "color2", "color3"],
            "beam_colors": ["color1", "color2"],
        }
    },
}
```

**Theme Guidelines:**
- Use hex colors without the `#` prefix
- Provide 3 primary colors for gradients
- Provide 2-3 accent colors
- Include a descriptive name and description
- Test with multiple effects to ensure good visibility

### 2. New Effects

The effects are powered by the `terminaltexteffects` library. To add support for a new effect:

1. Import the effect in `hakcer/banner.py`
2. Add configuration in the `_get_effect_config()` function
3. Add the effect name to the appropriate speed category list
4. Test the effect with various themes

### 3. Documentation

- Improve README examples
- Add more usage examples to `examples.py`
- Fix typos or unclear instructions
- Add screenshots/GIFs of themes and effects

### 4. Bug Fixes

- Check the [Issues](https://github.com/haKC-ai/hakcer/issues) page
- Fix any reported bugs
- Improve error handling
- Add validation for edge cases

### 5. Performance Improvements

- Optimize effect rendering
- Reduce startup time
- Improve memory usage

## 🧪 Testing

Before submitting a PR, ensure:

1. **All tests pass:**
   ```bash
   python test_package.py
   ```

2. **Your code works with different themes:**
   ```python
   from hakcer import show_banner, set_theme, list_themes

   for theme in list_themes():
       set_theme(theme)
       show_banner(effect_name="slide")
   ```

3. **No import errors:**
   ```bash
   python -c "from hakcer import *"
   ```

4. **Code style is consistent** with the existing codebase

## 📋 Pull Request Process

1. **Create a descriptive PR title**
   - Good: "Add Solarized Dark theme"
   - Bad: "Update themes.py"

2. **Describe your changes**
   - What does this PR do?
   - Why is it needed?
   - Any breaking changes?

3. **Reference related issues**
   - "Fixes #123"
   - "Closes #456"

4. **Include examples**
   - Show how to use new features
   - Add screenshots if applicable

5. **Update documentation**
   - Update README.md if needed
   - Add examples for new features
   - Update version in `__init__.py` if needed

## 📐 Code Style

- Follow PEP 8 guidelines
- Use meaningful variable names
- Add docstrings to functions
- Keep functions focused and small
- Comment complex logic

Example:
```python
def my_function(param1: str, param2: int = 0) -> bool:
    """
    Brief description of what the function does.

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Description of return value
    """
    # Implementation
    pass
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Python version**: `python --version`
2. **haKCer version**: `pip show hakcer`
3. **Operating system**: macOS, Linux, Windows
4. **Terminal**: iTerm2, Terminal.app, etc.
5. **Steps to reproduce**
6. **Expected behavior**
7. **Actual behavior**
8. **Error messages** (if any)

## 💡 Suggesting Enhancements

When suggesting enhancements:

1. **Check existing issues** to avoid duplicates
2. **Describe the enhancement** clearly
3. **Explain the use case** - why is it useful?
4. **Provide examples** of how it would work
5. **Consider alternatives** - are there other ways to achieve this?

## 🎨 Theme Design Guidelines

When creating new themes:

1. **Ensure contrast** - Text should be readable
2. **Test with multiple effects** - Not all effects work well with all color schemes
3. **Consider accessibility** - Avoid problematic color combinations
4. **Name appropriately** - Use descriptive, recognizable names
5. **Document inspiration** - Credit source if based on existing theme

Popular theme sources:
- Terminal themes (iTerm2, Alacritty, etc.)
- Code editor themes (VS Code, Sublime Text, etc.)
- Design systems (Material, Nord, etc.)

## 🔧 Development Tips

1. **Test locally before pushing:**
   ```bash
   pip install -e .
   python test_package.py
   ```

2. **Use virtual environments:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -e .
   ```

3. **Keep commits focused:**
   - One feature/fix per commit
   - Write clear commit messages
   - Use conventional commits format

4. **Stay updated:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: cory@haKC.ai for private inquiries

## 🙏 Recognition

Contributors will be:
- Listed in release notes
- Credited in CONTRIBUTORS.md (if created)
- Acknowledged in related discussions

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to haKCer!** 🚀
