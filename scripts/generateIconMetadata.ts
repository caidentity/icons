import * as fs from 'fs';
import * as path from 'path';
import type { IconMetadata, IconCategory } from '../types/icon';

const SVG_DIR = path.join(process.cwd(), 'public', 'icons');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'icons-metadata.json');

interface IconInfo extends Omit<IconMetadata, 'tags'> {
  tags: string[];
}

interface MetadataOutput {
  categories: Array<{
    name: string;
    description: string;
    icons: IconMetadata[];
  }>;
}

function formatIconName(fileName: string): string {
  return fileName
    .replace(/\.(svg)$/, '') // Only remove .svg extension, keep size indicator
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getIconSize(fileName: string): number {
  // Check for _16px, _16, 16px, or 16 at the end of the filename (before .svg)
  const sizeMatch = fileName.match(/_?(16|24)(?:px)?\.svg$/);
  return sizeMatch ? parseInt(sizeMatch[1], 10) : 24; // Default to 24 if no match
}

function generateTags(category: string, fileName: string): string[] {
  const tags = new Set<string>();
  
  // Add category as the primary tag
  tags.add(category.toLowerCase());
  
  // Add size-based tag
  if (fileName.includes('-small')) {
    tags.add('small');
  } else {
    tags.add('regular');
  }

  // Add common category-based variations
  switch (category.toLowerCase()) {
    case 'arrows':
      tags.add('direction');
      break;
    case 'brand':
      tags.add('social');
      tags.add('logo');
      break;
    case 'files':
      tags.add('document');
      break;
    case 'controls':
      tags.add('interface');
      break;
    case 'data':
      tags.add('analytics');
      break;
    case 'message':
      tags.add('communication');
      break;
    case 'money':
      tags.add('finance');
      break;
    case 'people':
      tags.add('user');
      break;
    case 'system':
      tags.add('settings');
      break;
  }
  
  return Array.from(tags);
}

function walkDir(dir: string): IconInfo[] {
  const icons: IconInfo[] = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      icons.push(...walkDir(filePath));
    } else if (file.endsWith('.svg')) {
      const category = path.basename(path.dirname(filePath));
      const displayName = formatIconName(file);
      const size = getIconSize(file);
      const relativePath = `/icons/${category}/${file}`;

      icons.push({
        name: displayName,
        size,
        category,
        path: relativePath,
        tags: generateTags(category, file)
      });
    }
  });

  return icons;
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    Arrows: "Directional and navigation arrows",
    Brand: "Brand and logo related icons",
    Communication: "Communication and messaging related icons",
    Controls: "UI control and interface elements",
    Data: "Data visualization and analytics icons",
    Files: "File and document related icons",
    Location: "Location and map related icons",
    Media: "Media playback and content icons",
    Message: "Messaging and notification icons",
    Money: "Finance and currency related icons",
    Nature: "Nature and environment related icons",
    Objects: "Common object and item icons",
    People: "People and user related icons",
    Shapes: "Basic shapes and geometric icons",
    System: "System and settings related icons",
    Text: "Typography and text formatting icons",
    Time: "Time and calendar related icons",
    View: "View and visibility related icons"
  };

  return descriptions[category] || `${category} related icons`;
}

function generateMetadata(): void {
  if (!fs.existsSync(SVG_DIR)) {
    console.error(`❌ SVG directory not found: ${SVG_DIR}`);
    process.exit(1);
  }

  const icons = walkDir(SVG_DIR);
  if (icons.length === 0) {
    console.warn('⚠️ No SVG files found!');
    return;
  }

  const categories = new Map<string, IconInfo[]>();

  icons.forEach(icon => {
    if (!categories.has(icon.category)) {
      categories.set(icon.category, []);
    }
    const categoryIcons = categories.get(icon.category);
    if (categoryIcons) {
      categoryIcons.push(icon);
    }
  });

  const metadata: MetadataOutput = {
    categories: Array.from(categories.entries()).map(([name, icons]) => ({
      name,
      description: getCategoryDescription(name),
      icons: icons.map(icon => ({
        ...icon,
        tags: [...icon.tags]
      }))
    }))
  };

  // Create directory if it doesn't exist with explicit permissions
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true, mode: 0o755 });
  }

  // Write file with explicit permissions
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2), { mode: 0o644 });
  
  // Ensure the file exists after writing
  if (!fs.existsSync(OUTPUT_FILE)) {
    console.error('❌ Failed to write metadata file');
    process.exit(1);
  }

  console.log(`✅ Generated metadata file at: ${OUTPUT_FILE}`);
  console.log(`📁 File permissions: ${fs.statSync(OUTPUT_FILE).mode}`);
}

generateMetadata(); 