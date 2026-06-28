import { NextResponse } from 'next/server'

export async function GET() {
  const nestUrl = process.env.NEST_API_URL || 'http://localhost:3200/v2'
  const res = await fetch(`${nestUrl}/rss.xml`, { next: { revalidate: 3600 } })
  if (!res.ok) return NextResponse.json({ error: 'RSS feed unavailable' }, { status: 502 })
  const xml = await res.text()
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
