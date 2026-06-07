'use client'

import { useEffect } from 'react'
import { useRequest } from 'ahooks'
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
        }
      },
      onError: (error) => {
        if ((error as Error).name === 'AbortError') return
        console.error('[player] 歌单初始化失败', error)
      },
    }
  )

  useEffect(() => {
    if (queue.length > 0) return
    const idleId = requestIdleCallback(() => fetchPlaylist(playlistId), { timeout: 2000 })
    return () => {
      cancelIdleCallback(idleId)
    }
  }, [queue.length, fetchPlaylist, playlistId])

  return (
    <>
      <AudioMiniPlayer />
      <AudioPlayerPanel />
    </>
  )
}
