#!/bin/bash
set -ex  # Exit on error and print commands

echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Directory structure:"
tree -L 3 || ls -R  # Use tree if available, fallback to ls -R

echo "Generating metadata..."
npm run generate-metadata

echo "Checking metadata file..."
if [ -f "public/icons-metadata.json" ]; then
    echo "✅ Metadata file exists"
    ls -la public/icons-metadata.json
    echo "Metadata file contents (first 10 lines):"
    head -n 10 public/icons-metadata.json
else
    echo "❌ Metadata file not found"
    echo "Contents of public directory:"
    ls -la public/
    exit 1
fi

echo "Building Next.js app..."
npm run build

echo "Checking build output..."
if [ -d ".next" ]; then
    echo "✅ Build successful"
    echo "Contents of .next directory:"
    ls -la .next/
else
    echo "❌ Build failed"
    exit 1
fi

echo "Build complete!" 