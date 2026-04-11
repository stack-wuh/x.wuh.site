import type { ReactNode } from 'react'

export type PlayerMode = 'order' | 'repeat-one' | 'shuffle'
export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface Track {
  id: number
  name: string
  artist: string
  album?: string
  coverUrl?: string
  duration?: number
  streamUrl?: string
  lyrics?: string
}

export interface TrackSource {
  streamUrl: string
  lyrics?: string
  duration?: number
}

export type TrackResolver = (trackId: number) => Promise<TrackSource>

export interface AudioPlayerState {
  queue: Track[]
  currentIndex: number
  progress: number
  duration: number
  volume: number
  mode: PlayerMode
  status: PlayerStatus
  isPanelOpen: boolean
  error?: string
}

export interface AudioPlayerActions {
  loadQueue: (tracks: Track[], options?: { startIndex?: number; autoPlay?: boolean }) => void
  playTrack: (trackId: number) => void
  playAt: (index: number) => void
  togglePlay: () => void
  playNext: () => void
  playPrevious: () => void
  seek: (seconds: number) => void
  setVolume: (volume: number) => void
  setMode: (mode: PlayerMode) => void
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
}

export interface AudioPlayerContextValue {
  state: AudioPlayerState
  queue: Track[]
  currentTrack: Track | null
  actions: AudioPlayerActions
}
export interface AudioPlayerProviderProps {
  children: ReactNode
  defaultVolume?: number
  trackResolver?: TrackResolver
}
