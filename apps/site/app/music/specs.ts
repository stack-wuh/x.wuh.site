import type { Track } from '@wuh.site/components/audio-player'

/** 兜底歌单：年度歌单拉取失败（未配置登录态、接口异常）时使用 */
export const DEFAULT_PLAYLIST_ID = process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID ?? '3778678'

/** 与服务端默认音质保持一致：匿名态下会按可用档位回退 */
export const TRACK_LEVEL = 'exhigh'

/** 网易云账号资料：配置登录态时随 user-playlists 返回；缺省时页头不展示身份区 */
export type MusicUserProfile = {
  nickname?: string
  avatarUrl?: string
  level?: number
}

/** 曲目带播放次数（配置登录态时服务端联表听歌排行；未上榜/匿名态缺省） */
export type MusicPlaylistTrack = Track & { playCount?: number }

/** 歌单接口返回结构（与服务端 PlaylistResultDto 对齐）；tags 由服务端后续补充，前端已预留渲染 */
export type MusicPlaylist = {
  playlistId: number
  name?: string
  description?: string
  tags?: string[]
  coverUrl?: string
  tracks: MusicPlaylistTrack[]
}

export type MusicUserPlaylistSummary = {
  id: number
  name: string
  coverUrl?: string
  trackCount: number
}

/** 年度歌单入口 + 账号资料（与服务端 UserPlaylistsResultDto 对齐） */
export type MusicUserPlaylists = {
  playlists: MusicUserPlaylistSummary[]
  profile?: MusicUserProfile
}

export const formatTrackDuration = (seconds?: number): string => {
  if (!seconds || seconds <= 0) return '--:--'
  const total = Math.round(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}
