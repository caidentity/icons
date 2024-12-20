import { IconMetadata, IconCategory } from '@/types/icon';

export async function loadIconMetadata(): Promise<IconCategory[]> {
  try {
    const response = await fetch('/icons-metadata.json');
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error loading icon metadata:', error);
    return [];
  }
}

export async function loadSvgContent(path: string): Promise<string | null> {
  try {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const response = await fetch(`/${cleanPath}`);
    const svgContent = await response.text();
    return svgContent;
  } catch (error) {
    console.error('Error loading SVG content:', error);
    return null;
  }
}

export function generateIconPath(icon: IconMetadata): string {
  return `/icons/${icon.category}/${icon.name}${icon.size === 16 ? '-small' : ''}.svg`;
} 