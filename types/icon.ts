export interface IconMetadata {
  name: string;
  size: number;
  tags: string[];
  category: string;
  path: string;
}

export interface IconCategory {
  name: string;
  description: string;
  icons: IconMetadata[];
} 