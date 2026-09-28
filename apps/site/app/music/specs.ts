import type { Track } from '@wuh.site/components/audio-player'

/** 歌单切换预设：切换走 URL 查询参数，由服务端重新取数 */
export const MUSIC_PLAYLIST_PRESETS = [
  { id: '3778678', label: '热歌榜' },
  { id: '19723756', label: '飙升榜' },
  { id: '3779629', label: '新歌榜' }
] as const

export const DEFAULT_PLAYLIST_ID = process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID ?? '3778678'

/** 与服务端默认音质保持一致：匿名态下会按可用档位回退 */
export const TRACK_LEVEL = 'exhigh'

export const SEARCH_LIMIT = 30

/** 歌单接口返回结构（与服务端 PlaylistResultDto 对齐） */
export type MusicPlaylist = {
  playlistId: number
  name?: string
  description?: string
  coverUrl?: string
  tracks: Track[]
}

export type MusicSearchResult = {
  keywords: string
  tracks: Track[]
}

export const formatTrackDuration = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return '--:--'
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
