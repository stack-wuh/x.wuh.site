import type { Track } from '@wuh.site/components/audio-player'

/** 兜底歌单：年度歌单拉取失败（未配置登录态、接口异常）时使用 */
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

/** 年度歌单摘要与服务端 UserPlaylistsResultDto 对齐：名字含「年度」的创建歌单，年份倒序 */
export type MusicUserPlaylistSummary = {
  id: number
  name: string
  coverUrl?: string
  trackCount: number
}

export type MusicUserPlaylists = {
  playlists: MusicUserPlaylistSummary[]
}

export const formatTrackDuration = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return '--:--'
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
