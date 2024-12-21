#!/bin/bash
set -e  # Exit on error

echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Generating metadata..."
npm run generate-metadata

echo "Checking metadata file..."
if [ -f "public/icons-metadata.json" ]; then
    echo "✅ Metadata file exists"
    ls -la public/icons-metadata.json
else
    echo "❌ Metadata file not found"
    exit 1
fi

echo "Building Next.js app..."
npm run build

echo "Checking build output..."
if [ -d ".next" ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo "Build complete!" 