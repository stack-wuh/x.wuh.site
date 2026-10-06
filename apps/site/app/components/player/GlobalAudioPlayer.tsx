'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import styled from 'styled-components'
import { useLocale } from '@wuh.site/components/locales'
import {
  AudioMiniPlayer,
  AudioPlayerPanel,
  useAudioPlayer,
  type Track
} from '@wuh.site/components/audio-player'

const FALLBACK_PLAYLIST_ID = process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID ?? '3778678'

const fetchPlaylistTracks = async (id: string): Promise<{ tracks?: Track[]; name?: string }> => {
  const res = await fetch(`/api/music/playlist?playlistId=${id}`)
  if (!res.ok) throw new Error('无法加载歌单')
  return res.json()
}

/**
 * 默认队列取最新一年的年度歌单；年度链路任一步不可得（未配置登录态、接口异常、空列表）
 * 都回落 env 兜底歌单，兜底也失败才把错误暴露给迷你播放器。
 */
const fetchDefaultPlaylistTracks = async (): Promise<{ tracks?: Track[]; name?: string }> => {
  try {
    const res = await fetch('/api/music/user-playlists')
    const data = res.ok ? await res.json() : null
    const latestId = Array.isArray(data?.playlists) && data.playlists.length ? String(data.playlists[0].id) : null
    if (latestId) return await fetchPlaylistTracks(latestId)
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
  }
  return fetchPlaylistTracks(FALLBACK_PLAYLIST_ID)
}

// 只在浏览器运行，统一走 window 上的定时器：Node 与 DOM 的 Timer 返回类型不同名
const scheduleIdle = (callback: () => void, timeout = 2000): number => {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(callback, { timeout })
  }
  return window.setTimeout(callback, timeout)
}

const cancelIdle = (id: number): void => {
  if (typeof window.cancelIdleCallback === 'function') {
    window.cancelIdleCallback(id)
    return
  }
  window.clearTimeout(id)
}

const PlaylistNotice = styled.div`
  position: fixed;
  left: 24px;
  bottom: 124px;
  z-index: 2400;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid color-mix(in oklab, var(--normal-400) 55%, transparent);
  border-radius: var(--border-radius-base);
  background: var(--background-100);
  box-shadow: var(--elevation-soft);
  color: color-mix(in oklab, var(--text-color) 72%, transparent);
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);

  @media (max-width: 640px) {
    left: 12px;
    bottom: 104px;
  }
`

const RetryButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: var(--primary-color);
  font-family: inherit;
  font-size: inherit;

  &:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
`

export const GlobalAudioPlayer = () => {
  const { t } = useLocale()
  const {
    queue,
    actions: { loadQueue }
  } = useAudioPlayer()
  const [playlistError, setPlaylistError] = useState<string | null>(null)

  const { run: loadDefaultQueue } = useRequest(fetchDefaultPlaylistTracks, {
    manual: true,
    onSuccess: (data) => {
      if (Array.isArray(data?.tracks) && data.tracks.length) {
        const normalized: Track[] = data.tracks.map((track: Track) => ({
          ...track,
          duration: typeof track.duration === 'number' ? track.duration : undefined
        }))
        loadQueue(normalized, { playlistName: data.name })
        setPlaylistError(null)
        return
      }
      setPlaylistError(t('player.playlist.empty'))
    },
    onError: (error) => {
      if ((error as Error).name === 'AbortError') return
      setPlaylistError(t('player.playlist.loadFailed'))
    }
  })

  const retryPlaylist = useCallback(() => {
    setPlaylistError(null)
    loadDefaultQueue()
  }, [loadDefaultQueue])

  useEffect(() => {
    if (queue.length > 0) return
    const idleId = scheduleIdle(() => loadDefaultQueue(), 2000)
    return () => {
      cancelIdle(idleId)
    }
  }, [queue.length, loadDefaultQueue])

  return (
    <>
      {playlistError ? (
        <PlaylistNotice role='status'>
          <span>{playlistError}</span>
          <RetryButton type='button' onClick={retryPlaylist}>
            {t('player.playlist.retry')}
          </RetryButton>
        </PlaylistNotice>
      ) : null}
      <AudioMiniPlayer />
      <AudioPlayerPanel />
    </>
  )
}
