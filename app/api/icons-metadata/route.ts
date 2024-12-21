import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'icons-metadata.json')
    const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    
    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load metadata' }, { status: 500 })
  }
} 