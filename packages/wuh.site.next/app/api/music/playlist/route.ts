import { NextResponse, type NextRequest } from 'next/server'
import { requestNetEase } from '../client'

const DEFAULT_PLAYLIST_ID = process.env.NETEASE_DEFAULT_PLAYLIST_ID ?? '3778678'

type NetEaseArtist = {
  name?: string
}

type NetEaseAlbum = {
  name?: string
  picUrl?: string
}

interface NetEaseTrack {
  id: number | string
  name: string
  ar?: NetEaseArtist[]
  artists?: NetEaseArtist[]
  al?: NetEaseAlbum
  album?: NetEaseAlbum
  dt?: number
}

const normalizeTrack = (track: NetEaseTrack) => {
  const artists = track?.ar ?? track?.artists ?? []
  const album = track?.al ?? track?.album ?? {}
  const trackId = Number(track?.id)
  return {
    id: Number.isFinite(trackId) ? trackId : track?.id,
    name: track?.name,
    artist: artists.map((item) => item?.name).filter(Boolean).join(' / '),
    album: album.name,
    coverUrl: album.picUrl ? `${album.picUrl}?param=600y600` : undefined,
    duration: typeof track?.dt === 'number' ? track.dt / 1000 : undefined
  }
}

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get('playlistId') ?? DEFAULT_PLAYLIST_ID
  try {
    const response = await requestNetEase('/playlist/detail', `?id=${playlistId}`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      return NextResponse.json({ error: '无法获取歌单' }, { status: response.status })
    }
    const data = await response.json()
    const playlist = data?.playlist
    const tracks = Array.isArray(playlist?.tracks) ? playlist.tracks.map(normalizeTrack) : []
    return NextResponse.json({
      playlistId: Number(playlistId),
      name: playlist?.name,
      description: playlist?.description,
      coverUrl: playlist?.coverImgUrl,
      tracks
    })
  } catch (error) {
    console.error('[music] playlist error', error)
    return NextResponse.json({ error: '获取歌单失败' }, { status: 500 })
  }
}
