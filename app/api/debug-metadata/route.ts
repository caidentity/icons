import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const paths = [
    path.join(process.cwd(), 'public', 'icons-metadata.json'),
    path.join(process.cwd(), 'icons-metadata.json'),
    path.join(process.cwd(), '.next', 'server', 'public', 'icons-metadata.json')
  ]

  const results = await Promise.all(
    paths.map(async (p) => {
      try {
        const stats = await fs.stat(p)
        return {
          path: p,
          exists: true,
          size: stats.size,
          isFile: stats.isFile()
        }
      } catch (e) {
        return {
          path: p,
          exists: false,
          error: (e as Error).message
        }
      }
    })
  )

  return NextResponse.json({
    cwd: process.cwd(),
    env: process.env.NODE_ENV,
    paths: results
  })
} 