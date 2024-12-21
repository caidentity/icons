import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'icons-metadata.json')
    const fileContent = await fs.readFile(filePath, 'utf8')
    const metadata = JSON.parse(fileContent)
    
    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (_error) {
    // Log error internally but don't expose details
    console.error('Failed to load metadata:', _error)
    return NextResponse.json({ error: 'Failed to load metadata' }, { status: 500 })
  }
} 