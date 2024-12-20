import fs from 'fs';
import path from 'path';

const SVG_DIR = path.join(process.cwd(), 'public', 'svg');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'icons-metadata.json');

interface IconInfo {
  name: string;
  size: number;
  category: string;
  path: string;
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
      const name = file.replace(/-small\.svg$|\.svg$/, '');
      const size = file.includes('-small') ? 16 : 24;
      const relativePath = filePath
        .replace(process.cwd() + '/public', '')
        .split(path.sep)
        .join('/');

      icons.push({
        name,
        size,
        category,
        path: relativePath,
      });
    }
  });

  return icons;
}

function generateMetadata() {
  if (!fs.existsSync(SVG_DIR)) {
    console.error(`SVG directory not found: ${SVG_DIR}`);
    process.exit(1);
  }

  const icons = walkDir(SVG_DIR);
  if (icons.length === 0) {
    console.warn('No SVG files found!');
  }

  const categories = new Map<string, IconInfo[]>();

  icons.forEach(icon => {
    if (!categories.has(icon.category)) {
      categories.set(icon.category, []);
    }
    categories.get(icon.category)!.push(icon);
  });

  const metadata = {
    categories: Array.from(categories.entries()).map(([name, icons]) => ({
      name,
      description: `${name} related icons`,
      icons: icons.map(icon => ({
        ...icon,
        tags: [icon.category.toLowerCase(), name.toLowerCase()]
      }))
    }))
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(metadata, null, 2));
  console.log(`Generated metadata for ${icons.length} icons in ${categories.size} categories`);
  console.log('Categories found:', Array.from(categories.keys()));
}

generateMetadata(); 