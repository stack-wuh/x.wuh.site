const ALLOWED_HOSTS = [
  'cdn.wuh.site',
  'avatars.githubusercontent.com',
  'avatars.githubusercontent.com',
  'user-images.githubusercontent.com',
  'raw.githubusercontent.com',
  'camo.githubusercontent.com',
  'cloud.tencent.com',
  'image.myqcloud.com',
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) return new Response('Missing url', { status: 400 })

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return new Response('Invalid url', { status: 400 })
  }

  const allowed = ALLOWED_HOSTS.some(
    (h) => parsedUrl.hostname === h || parsedUrl.hostname.endsWith('.' + h),
  )
  if (!allowed) return new Response('Host not allowed', { status: 403 })

  try {
    const res = await fetch(parsedUrl.href, {
      headers: { 'User-Agent': 'wuh.site-image-proxy/1.0' },
    })
    if (!res.ok) return new Response('Fetch failed', { status: res.status })

    const blob = await res.blob()
    const contentType = res.headers.get('Content-Type') || blob.type || 'image/*'

    return new Response(blob, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    })
  } catch {
    return new Response('Fetch error', { status: 502 })
  }
}
