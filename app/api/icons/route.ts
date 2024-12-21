import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'api', 'icons-metadata.json');
    const data = await fs.readFile(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (_error) {
    console.error('Failed to load icons:', _error);
    return NextResponse.json({ error: 'Failed to load icon' }, { status: 500 });
  }
} 