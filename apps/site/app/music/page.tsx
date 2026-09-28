import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@wuh.site/core'
import { API_BASE } from '@wuh.site/hooks/useFetch/apiBase'
import { fetcher } from '@wuh.site/hooks/useFetch/fetcher'
import MusicView from './MusicView'
import { DEFAULT_PLAYLIST_ID, type MusicPlaylist, type MusicUserPlaylists } from './specs'

const PAGE_DESCRIPTION = '吴尒红（Shadow）的站点歌单：随时开播的迷你播放器与曲目列表'

export const metadata: Metadata = {
  title: '音乐',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/music` },
  openGraph: {
    title: '音乐',
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/music`,
    siteName: SITE_NAME,
    type: 'website'
  }
}

type MusicSearchParams = { playlist?: string | string[] }

/**
 * 歌单是页面主体，首屏等待；数据层带 10 分钟量级缓存（播放地址不在此列，按需另取）。
 * 失败返回 null，由视图给出可见失败态而不是让页面报错。
 */
async function getPlaylist(playlistId: string): Promise<MusicPlaylist | null> {
  const { data, error } = await fetcher<MusicPlaylist>(`${API_BASE}/music/playlist`, {
    query: { playlistId },
    ext: { next: { revalidate: 600 } }
  })

  if (error || !data || !Array.isArray(data.tracks)) return null
  return data
}

/** 年度歌单是入口导航：失败或未配置登录态返回 null，由视图隐藏入口而不是报错 */
async function getUserPlaylists(): Promise<MusicUserPlaylists | null> {
  const { data, error } = await fetcher<MusicUserPlaylists>(`${API_BASE}/music/user-playlists`, {
    ext: { next: { revalidate: 600 } }
  })

  if (error || !data || !Array.isArray(data.playlists)) return null
  return data
}

export default async function Page({
  searchParams
}: {
  searchParams?: MusicSearchParams | Promise<MusicSearchParams>
}) {
  const resolved = await searchParams
  const requested = Array.isArray(resolved?.playlist) ? resolved?.playlist[0] : resolved?.playlist
  const requestedId = requested?.trim() || null

  // 入口列表与主体歌单并行取数；未指定歌单时缺省选中最新一年，选中项与兜底取数不同时补一次（走缓存）
  const [mine, fallbackPlaylist] = await Promise.all([
    getUserPlaylists(),
    getPlaylist(requestedId ?? DEFAULT_PLAYLIST_ID)
  ])

  const playlistId = requestedId ?? mine?.playlists[0]?.id?.toString() ?? DEFAULT_PLAYLIST_ID
  // 未指定歌单且最新年度不是兜底歌单时，按年度选中项补一次取数（与预取结果一样带缓存）
  const playlist = !requestedId && playlistId !== DEFAULT_PLAYLIST_ID ? await getPlaylist(playlistId) : fallbackPlaylist

  return <MusicView playlistId={playlistId} playlist={playlist} annualPlaylists={mine?.playlists ?? []} />
}
