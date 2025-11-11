"""Setup script for haKCer package."""

from setuptools import setup, find_packages
from pathlib import Path

# Read the long description from README
this_directory = Path(__file__).parent
long_description = (this_directory / "README_PYPI.md").read_text(encoding="utf-8")

setup(
    name="hakcer",
    version="1.1.0",
    author="haKCer",
    author_email="cory@haKC.ai",
    description="Animated ASCII banner with terminal effects and customizable themes for CLI tools",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/haKC-ai/hakcer",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Terminals",
        "Topic :: System :: Shells",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        "terminaltexteffects>=0.11.0",
        "rich>=13.0.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-cov>=4.0.0",
            "black>=23.0.0",
            "flake8>=6.0.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "hakcer=hakcer.banner:main",
        ],
    },
    keywords="cli banner ascii terminal effects animation themes tokyo-night cyberpunk",
    project_urls={
        "Bug Reports": "https://github.com/haKC-ai/hakcer/issues",
        "Source": "https://github.com/haKC-ai/hakcer",
    },
)
