import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function checkFile(filepath: string) {
  try {
    const stats = await fs.stat(filepath);
    const content = await fs.readFile(filepath, 'utf8');
    return {
      exists: true,
      size: stats.size,
      isFile: stats.isFile(),
      modifiedTime: stats.mtime,
      preview: content.substring(0, 200)
    };
  } catch (e) {
    return {
      exists: false,
      error: (e as Error).message
    };
  }
}

export async function GET() {
  const cwd = process.cwd();
  
  const paths = {
    public: path.join(cwd, 'public', 'icons-metadata.json'),
    root: path.join(cwd, 'icons-metadata.json'),
    next: path.join(cwd, '.next', 'server', 'public', 'icons-metadata.json')
  };

  const results = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      CWD: cwd
    },
    files: {
      public: await checkFile(paths.public),
      root: await checkFile(paths.root),
      next: await checkFile(paths.next)
    },
    directories: {
      public: await fs.readdir(path.join(cwd, 'public')).catch(() => []),
      root: await fs.readdir(cwd).catch(() => []),
      next: await fs.readdir(path.join(cwd, '.next')).catch(() => [])
    }
  };

  return NextResponse.json(results);
}