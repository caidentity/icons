#!/bin/bash
set -ex  # Exit on error and print commands

echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

echo "Generating metadata..."
npm run generate-metadata

echo "Checking metadata file..."
if [ -f "public/icons-metadata.json" ]; then
    echo "✅ Metadata file exists"
    ls -la public/icons-metadata.json
else
    echo "❌ Metadata file not found"
    echo "Contents of public directory:"
    ls -la public/
    exit 1
fi

echo "Building Next.js app..."
next build

echo "Build complete!" 