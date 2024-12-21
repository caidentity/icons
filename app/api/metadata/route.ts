import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  console.log('Metadata API called, CWD:', process.cwd())
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV)

  try {
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'icons-metadata.json'),
      path.join(process.cwd(), 'icons-metadata.json'),
      path.join(process.cwd(), '.next', 'server', 'public', 'icons-metadata.json')
    ]

    console.log('Checking paths:', possiblePaths)

    let metadata = null
    let foundPath = null

    for (const filePath of possiblePaths) {
      try {
        console.log('Trying path:', filePath)
        const exists = await fs.stat(filePath).then(() => true).catch(() => false)
        console.log('Path exists?', filePath, exists)
        
        if (exists) {
          const fileContent = await fs.readFile(filePath, 'utf8')
          metadata = JSON.parse(fileContent)
          foundPath = filePath
          console.log('Successfully loaded from:', filePath)
          break
        }
      } catch (_err) {
        console.log('Failed to load from:', filePath)
        continue
      }
    }

    if (!metadata) {
      console.error('Metadata file not found in any location')
      return NextResponse.json({ error: 'Metadata file not found' }, { status: 404 })
    }

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