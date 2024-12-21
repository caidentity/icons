import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const metadataPath = path.join(process.cwd(), 'public', 'icons-metadata.json');
    const exists = await fs.access(metadataPath)
      .then(() => true)
      .catch(() => false);
    
    const stats = exists ? await fs.stat(metadataPath) : null;

    return NextResponse.json({
      exists,
      stats: stats ? {
        size: stats.size,
        mode: stats.mode,
        mtime: stats.mtime
      } : null,
      cwd: process.cwd(),
      fullPath: metadataPath
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 