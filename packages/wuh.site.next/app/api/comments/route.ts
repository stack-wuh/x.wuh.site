import { NextResponse, type NextRequest } from 'next/server'

const nestApiUrl =
  process.env.NEST_API_URL ||
  (process.env.NODE_ENV === 'production' ? 'http://nest:3200/v2' : 'http://localhost:3200/v2')

const toErrorMessage = (value: unknown) => {
  if (value instanceof Error) return value.message
  if (typeof value === 'string') return value
  return '留言服务暂时不可用'
}

const parseResponseBody = (text: string) => {
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

const logGuestbookError = (message: string, meta: Record<string, unknown>) => {
  process.stderr.write(`[guestbook] ${message} ${JSON.stringify(meta)}\n`)
}

export async function POST(request: NextRequest) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ message: '请求内容不是合法 JSON' }, { status: 400 })
  }

  try {
    const upstream = await fetch(`${nestApiUrl}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const text = await upstream.text()
    const data = parseResponseBody(text)

    if (!upstream.ok) {
      logGuestbookError('comment submit failed', {
        status: upstream.status,
        data,
      })
      return NextResponse.json(data, { status: upstream.status })
    }

    return NextResponse.json(data, { status: upstream.status })
  } catch (error) {
    const message = toErrorMessage(error)
    logGuestbookError('comment submit proxy failed', {
      message,
      nestApiUrl,
    })
    return NextResponse.json({ message }, { status: 502 })
  }
}
