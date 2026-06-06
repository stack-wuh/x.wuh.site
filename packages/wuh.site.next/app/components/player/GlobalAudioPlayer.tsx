'use client'

import { useEffect } from 'react'
import {
  AudioMiniPlayer,
  AudioPlayerPanel,
  useAudioPlayer,
  type Track
} from '@wuh.site/components/audio-player'

const FALLBACK_PLAYLIST_ID = process.env.NEXT_PUBLIC_NETEASE_PLAYLIST_ID ?? '3778678'

export const GlobalAudioPlayer = () => {
  const {
    queue,
    actions: { loadQueue }
  } = useAudioPlayer()
  const playlistId = FALLBACK_PLAYLIST_ID

  useEffect(() => {
    if (queue.length > 0) return
    let cancelled = false
    const controller = new AbortController()

    const bootstrap = async () => {
      try {
        const res = await fetch(`/api/music/playlist?playlistId=${playlistId}`, {
          signal: controller.signal
        })
        if (!res.ok) {
          throw new Error('无法加载歌单')
        }
        const data = await res.json()
        if (cancelled) return
        if (Array.isArray(data?.tracks) && data.tracks.length) {
          const normalized: Track[] = data.tracks.map((track: Track) => ({
            ...track,
            duration: typeof track.duration === 'number' ? track.duration : undefined
          }))
          loadQueue(normalized)
        }
      } catch (error) {
        if (cancelled || (error as Error).name === 'AbortError') return
        console.error('[player] 歌单初始化失败', error)
      }
    }

    const idleId = requestIdleCallback(() => bootstrap(), { timeout: 2000 })
    return () => {
      cancelled = true
      controller.abort()
      cancelIdleCallback(idleId)
    }
  }, [queue.length, loadQueue, playlistId])

  return (
    <>
      <AudioMiniPlayer />
      <AudioPlayerPanel />
    </>
  )
}
