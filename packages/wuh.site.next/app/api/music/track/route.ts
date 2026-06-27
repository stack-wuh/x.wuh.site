import { NextResponse, type NextRequest } from 'next/server'
import { requestNetEase } from '../client'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const id = request.nextUrl.searchParams.get('id')
  const level = request.nextUrl.searchParams.get('level') ?? 'exhigh'
  if (!id) {
    return NextResponse.json({ error: '缺少歌曲 id' }, { status: 400 })
  }

  try {
    const [urlRes, lyricRes] = await Promise.all([
      requestNetEase('/song/url/v1', `?id=${id}&level=${level}`, { cache: 'no-store' }),
      requestNetEase('/lyric', `?id=${id}`, { cache: 'no-store' })
    ])

    if (!urlRes.ok) {
      return NextResponse.json({ error: '获取音频地址失败' }, { status: urlRes.status })
    }

    const urlJson = await urlRes.json()
    const lyricJson = lyricRes.ok ? await lyricRes.json() : undefined
    const data = Array.isArray(urlJson?.data) ? urlJson.data[0] : urlJson?.data

    return NextResponse.json({
      streamUrl: data?.url,
      duration: typeof data?.time === 'number' ? data.time / 1000 : undefined,
      lyrics: lyricJson?.lrc?.lyric ?? lyricJson?.klyric?.lyric
    })
  } catch {
    return NextResponse.json({ error: '获取歌曲信息失败' }, { status: 500 })
  }
}
