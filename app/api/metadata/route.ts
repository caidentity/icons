import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Try multiple possible paths for the metadata file
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'icons-metadata.json'),
      path.join(process.cwd(), 'icons-metadata.json'),
      // Add .next/server/public path for production
      path.join(process.cwd(), '.next', 'server', 'public', 'icons-metadata.json')
    ]

    let metadata = null
    let foundPath = null

    // Try each path until we find the file
    for (const filePath of possiblePaths) {
      try {
        const fileContent = await fs.readFile(filePath, 'utf8')
        metadata = JSON.parse(fileContent)
        foundPath = filePath
        break
      } catch (_err) {
        // Ignore error and continue to next path
        continue
      }
    }

    if (!metadata) {
      console.error('Metadata file not found in any of the expected locations:', possiblePaths)
      return NextResponse.json({ error: 'Metadata file not found' }, { status: 404 })
    }

    console.log('Successfully loaded metadata from:', foundPath)
    
    return NextResponse.json(metadata, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (_error) {
    console.error('Error serving metadata:', _error)
    return NextResponse.json({ error: 'Failed to load metadata' }, { status: 500 })
  }
} 