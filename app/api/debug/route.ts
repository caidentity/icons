import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const headersList = headers();
  
  // Check if files exist
  const publicDir = path.join(process.cwd(), 'public');
  const metadataPath = path.join(publicDir, 'icons-metadata.json');
  
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cwd: process.cwd(),
    files: {
      publicDir: {
        exists: fs.existsSync(publicDir),
        contents: fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : null
      },
      metadataFile: {
        exists: fs.existsSync(metadataPath),
        size: fs.existsSync(metadataPath) ? fs.statSync(metadataPath).size : null
      }
    },
    headers: Object.fromEntries(headersList.entries())
  };

  return NextResponse.json(debug);
} 