// Define interfaces without export
interface IconMetadataType {
  name: string;
  size: number;
  tags: string[];
  category: string;
  path: string;
}

interface IconCategoryType {
  name: string;
  description: string;
  icons: IconMetadataType[];
}

// Export only the type declarations
export type IconMetadata = IconMetadataType;
export type IconCategory = IconCategoryType; 