#!/bin/bash
echo "Generating metadata..."
npm run generate-metadata

echo "Building Next.js app..."
npm run build

echo "Build complete!" 