import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface DebugInfo {
  environment: {
    NODE_ENV: string;
    VERCEL_ENV: string | undefined;
    cwd: string;
  };
  paths: {
    publicDir: string;
    metadataPath: string;
  };
  exists: {
    publicDir: boolean;
    metadataFile: boolean;
  };
  publicContents: string[];
  metadata?: {
    size: number;
    modified: Date;
    mode: string;
  };
}

export async function GET() {
  try {
    const cwd = process.cwd();
    const publicDir = path.join(cwd, 'public');
    const metadataPath = path.join(publicDir, 'icons-metadata.json');

    const debug: DebugInfo = {
      environment: {
        NODE_ENV: process.env.NODE_ENV || 'unknown',
        VERCEL_ENV: process.env.VERCEL_ENV,
        cwd: cwd,
      },
      paths: {
        publicDir,
        metadataPath,
      },
      exists: {
        publicDir: await fs.access(publicDir).then(() => true).catch(() => false),
        metadataFile: await fs.access(metadataPath).then(() => true).catch(() => false),
      },
      publicContents: await fs.readdir(publicDir).catch(() => []),
    };

    if (debug.exists.metadataFile) {
      const stats = await fs.stat(metadataPath);
      debug.metadata = {
        size: stats.size,
        modified: stats.mtime,
        mode: stats.mode.toString(8),
      };
    }

    return NextResponse.json(debug);
  } catch (error) {
    return NextResponse.json({
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}