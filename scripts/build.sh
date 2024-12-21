#!/bin/bash
set -ex  # Exit on error and print commands

echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Ensure the public directory exists
mkdir -p public

echo "Generating metadata..."
NODE_ENV=production npm run generate-metadata

echo "Checking metadata file..."
if [ -f "public/icons-metadata.json" ]; then
    echo "✅ Metadata file exists"
    ls -la public/icons-metadata.json
    
    # Create necessary directories and copy files
    mkdir -p .next/server/public
    cp public/icons-metadata.json .next/server/public/
    cp public/icons-metadata.json ./
    
    echo "Copied metadata files to additional locations"
    ls -la .next/server/public/icons-metadata.json || echo "Failed to copy to .next/server/public"
    ls -la ./icons-metadata.json || echo "Failed to copy to root"
else
    echo "❌ Metadata file not found"
    echo "Contents of public directory:"
    ls -la public/
    exit 1
fi

echo "Building Next.js app..."
NODE_ENV=production next build

echo "Final verification..."
echo "Checking all possible metadata locations:"
ls -la public/icons-metadata.json || echo "Not in public/"
ls -la .next/server/public/icons-metadata.json || echo "Not in .next/server/public/"
ls -la ./icons-metadata.json || echo "Not in root"

echo "Build complete!" 