'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import styled from 'styled-components'
import {
  AudioMiniPlayer,
  AudioPlayerPanel,
  useAudioPlayer,
  type Track
} from '@wuh.site/components/audio-player'

const FALLBACK_PLAYLIST_ID = process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID ?? '3778678'

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
  const {
    queue,
    actions: { loadQueue }
  } = useAudioPlayer()
  const playlistId = FALLBACK_PLAYLIST_ID
  const [playlistError, setPlaylistError] = useState<string | null>(null)

  const { run: fetchPlaylist } = useRequest(
    async (id: string) => {
      const res = await fetch(`/api/music/playlist?playlistId=${id}`)
      if (!res.ok) throw new Error('无法加载歌单')
      return res.json()
    },
    {
      manual: true,
      onSuccess: (data) => {
        if (Array.isArray(data?.tracks) && data.tracks.length) {
          const normalized: Track[] = data.tracks.map((track: Track) => ({
            ...track,
            duration: typeof track.duration === 'number' ? track.duration : undefined
          }))
          loadQueue(normalized)
          setPlaylistError(null)
          return
        }
        setPlaylistError('歌单里暂时没有可播放的曲目')
      },
      onError: (error) => {
        if ((error as Error).name === 'AbortError') return
        console.error(error)
        setPlaylistError('歌单加载失败，播放器暂时不可用')
      }
    }
  )

  const retryPlaylist = useCallback(() => {
    setPlaylistError(null)
    fetchPlaylist(playlistId)
  }, [fetchPlaylist, playlistId])

  useEffect(() => {
    if (queue.length > 0) return
    const idleId = scheduleIdle(() => fetchPlaylist(playlistId), 2000)
    return () => {
      cancelIdle(idleId)
    }
  }, [queue.length, fetchPlaylist, playlistId])

  return (
    <>
      {playlistError ? (
        <PlaylistNotice role='status'>
          <span>{playlistError}</span>
          <RetryButton type='button' onClick={retryPlaylist}>
            重试
          </RetryButton>
        </PlaylistNotice>
      ) : null}
      <AudioMiniPlayer />
      <AudioPlayerPanel />
    </>
  )
}
