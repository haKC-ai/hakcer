#!/bin/bash

# Upload haKCer package to PyPI
# Make sure you have your PyPI token in ~/.pypirc

echo "======================================"
echo "Upload haKCer to PyPI"
echo "======================================"
echo ""

# Check if dist/ exists
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "ERROR: dist/ directory is empty or missing"
    echo "Run ./build_package.sh first"
    exit 1
fi

echo "Distribution files to upload:"
ls -lh dist/
echo ""

echo "Choose destination:"
echo "  1) PyPI (production) - https://pypi.org/"
echo "  2) TestPyPI (testing) - https://test.pypi.org/"
echo ""
read -p "Enter choice (1-2): " choice

case $choice in
    1)
        echo ""
        echo "Uploading to PyPI..."
        python3 -m twine upload dist/*
        if [ $? -eq 0 ]; then
            echo ""
            echo "======================================"
            echo "Success! Package is live on PyPI"
            echo "======================================"
            echo ""
            echo "View at: https://pypi.org/project/hakcer/"
            echo "Install with: pip install hakcer"
        fi
        ;;
    2)
        echo ""
        echo "Uploading to TestPyPI..."
        python3 -m twine upload --repository testpypi dist/*
        if [ $? -eq 0 ]; then
            echo ""
            echo "======================================"
            echo "Success! Package is on TestPyPI"
            echo "======================================"
            echo ""
            echo "View at: https://test.pypi.org/project/hakcer/"
            echo "Install with: pip install --index-url https://test.pypi.org/simple/ --extra-index-url https://pypi.org/simple hakcer"
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
