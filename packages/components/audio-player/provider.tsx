'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from 'react'
import type {
  AudioPlayerContextValue,
  AudioPlayerProviderProps,
  PlayerMode,
  Track,
  TrackResolver
} from './specs'

const initialState = {
  queue: [] as Track[],
  currentIndex: -1,
  progress: 0,
  duration: 0,
  volume: 0.8,
  mode: 'order' as PlayerMode,
  status: 'idle' as const,
  isPanelOpen: false,
  error: undefined as string | undefined
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)

type Action =
  | { type: 'LOAD_QUEUE'; payload: { queue: Track[]; startIndex: number } }
  | { type: 'SET_STATUS'; payload: { status: typeof initialState.status; error?: string } }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_MODE'; payload: PlayerMode }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_PANEL'; payload: boolean }
  | { type: 'UPDATE_TRACK'; payload: { trackId: number; data: Partial<Track> } }

const reducer = (state: typeof initialState, action: Action): typeof initialState => {
  switch (action.type) {
    case 'LOAD_QUEUE':
      return {
        ...state,
        queue: action.payload.queue,
        currentIndex: action.payload.startIndex,
        progress: 0,
        duration: action.payload.queue[action.payload.startIndex]?.duration ?? 0,
        status: 'idle',
        error: undefined
      }
    case 'SET_STATUS':
      return { ...state, status: action.payload.status, error: action.payload.error }
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload }
    case 'SET_DURATION':
      return { ...state, duration: action.payload }
    case 'SET_VOLUME':
      return { ...state, volume: action.payload }
    case 'SET_MODE':
      return { ...state, mode: action.payload }
    case 'SET_CURRENT_INDEX':
      return { ...state, currentIndex: action.payload, progress: 0 }
    case 'SET_PANEL':
      return { ...state, isPanelOpen: action.payload }
    case 'UPDATE_TRACK':
      return {
        ...state,
        queue: state.queue.map((track) =>
          track.id === action.payload.trackId ? { ...track, ...action.payload.data } : track
        )
      }
    default:
      return state
  }
}

const getNextIndex = (mode: PlayerMode, currentIndex: number, queue: Track[]) => {
  if (!queue.length) return -1
  if (mode === 'repeat-one') {
    return currentIndex
  }
  if (mode === 'shuffle') {
    if (queue.length === 1) return currentIndex
    let next = currentIndex
    while (next === currentIndex) {
      next = Math.floor(Math.random() * queue.length)
    }
    return next
  }
  const nextIndex = currentIndex + 1
  return nextIndex >= queue.length ? 0 : nextIndex
}

const getPreviousIndex = (mode: PlayerMode, currentIndex: number, queue: Track[]) => {
  if (!queue.length) return -1
  if (mode === 'repeat-one') {
    return currentIndex
  }
  if (mode === 'shuffle') {
    if (queue.length === 1) return currentIndex
    let prev = currentIndex
    while (prev === currentIndex) {
      prev = Math.floor(Math.random() * queue.length)
    }
    return prev
  }
  const prevIndex = currentIndex - 1
  return prevIndex < 0 ? queue.length - 1 : prevIndex
}

export const AudioPlayerProvider = ({
  children,
  defaultVolume = 0.8,
  trackResolver
}: AudioPlayerProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    volume: defaultVolume
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const stateRef = useRef(state)
  const resolverRef = useRef<TrackResolver | undefined>(trackResolver)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    resolverRef.current = trackResolver
  }, [trackResolver])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.volume = defaultVolume
    audioRef.current = audio

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime })
    }
    const handleDurationChange = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 })
    }
    const handleEnded = () => {
      handleTrackEnd()
    }
    const handleError = () => {
      dispatch({ type: 'SET_STATUS', payload: { status: 'error', error: '无法播放音频' } })
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [defaultVolume])

  const ensureTrackSource = useCallback(async (track: Track): Promise<Track> => {
    if (track.streamUrl) {
      return track
    }
    if (!resolverRef.current) {
      throw new Error('缺少 trackResolver，无法解析音频资源')
    }
    const result = await resolverRef.current(track.id)
    if (!result?.streamUrl) {
      throw new Error('未获取到音频地址')
    }
    const enrichedTrack = {
      ...track,
      streamUrl: result.streamUrl,
      lyrics: result.lyrics ?? track.lyrics,
      duration: result.duration ?? track.duration
    }
    dispatch({ type: 'UPDATE_TRACK', payload: { trackId: track.id, data: enrichedTrack } })
    return enrichedTrack
  }, [])

  const playTrackAt = useCallback(
    async (index: number) => {
      const audio = audioRef.current
      if (!audio) return
      const queue = stateRef.current.queue
      const track = queue[index]
      if (!track) return
      dispatch({ type: 'SET_STATUS', payload: { status: 'loading' } })
      try {
        const playableTrack = await ensureTrackSource(track)
        audio.src = playableTrack.streamUrl ?? ''
        audio.currentTime = 0
        await audio.play()
        dispatch({ type: 'SET_CURRENT_INDEX', payload: index })
        dispatch({ type: 'SET_STATUS', payload: { status: 'playing' } })
        const duration = playableTrack.duration ?? audio.duration ?? 0
        dispatch({ type: 'SET_DURATION', payload: duration })
      } catch (error) {
        console.error(error)
        dispatch({ type: 'SET_STATUS', payload: { status: 'error', error: '播放失败' } })
      }
    },
    [ensureTrackSource]
  )

  const handleTrackEnd = useCallback(() => {
    const nextIndex = getNextIndex(stateRef.current.mode, stateRef.current.currentIndex, stateRef.current.queue)
    if (nextIndex === -1) {
      dispatch({ type: 'SET_STATUS', payload: { status: 'idle' } })
      return
    }
    playTrackAt(nextIndex)
  }, [playTrackAt])

  const loadQueue = useCallback(
    (tracks: Track[], options?: { startIndex?: number; autoPlay?: boolean }) => {
      if (!tracks?.length) return
      const startIndex = options?.startIndex ?? 0
      dispatch({ type: 'LOAD_QUEUE', payload: { queue: tracks, startIndex } })
      if (options?.autoPlay) {
        playTrackAt(startIndex)
      }
    },
    [playTrackAt]
  )

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (stateRef.current.status === 'playing') {
      audio.pause()
      dispatch({ type: 'SET_STATUS', payload: { status: 'paused' } })
      return
    }
    if (stateRef.current.status === 'paused') {
      audio.play()
      dispatch({ type: 'SET_STATUS', payload: { status: 'playing' } })
      return
    }
    const index = stateRef.current.currentIndex >= 0 ? stateRef.current.currentIndex : 0
    playTrackAt(index)
  }, [playTrackAt])

  const playTrack = useCallback(
    (trackId: number) => {
      const queue = stateRef.current.queue
      const index = queue.findIndex((track) => track.id === trackId)
      if (index >= 0) {
        playTrackAt(index)
      }
    },
    [playTrackAt]
  )

  const playNext = useCallback(() => {
    const nextIndex = getNextIndex(stateRef.current.mode, stateRef.current.currentIndex, stateRef.current.queue)
    if (nextIndex !== -1) {
      playTrackAt(nextIndex)
    }
  }, [playTrackAt])

  const playPrevious = useCallback(() => {
    const prevIndex = getPreviousIndex(stateRef.current.mode, stateRef.current.currentIndex, stateRef.current.queue)
    if (prevIndex !== -1) {
      playTrackAt(prevIndex)
    }
  }, [playTrackAt])

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || seconds))
    dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime })
  }, [])

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current
    const nextVolume = Math.max(0, Math.min(volume, 1))
    if (audio) {
      audio.volume = nextVolume
    }
    dispatch({ type: 'SET_VOLUME', payload: nextVolume })
  }, [])

  const setMode = useCallback((mode: PlayerMode) => {
    dispatch({ type: 'SET_MODE', payload: mode })
  }, [])

  const openPanel = useCallback(() => {
    dispatch({ type: 'SET_PANEL', payload: true })
  }, [])

  const closePanel = useCallback(() => {
    dispatch({ type: 'SET_PANEL', payload: false })
  }, [])

  const togglePanel = useCallback(() => {
    dispatch({ type: 'SET_PANEL', payload: !stateRef.current.isPanelOpen })
  }, [])

  const contextValue = useMemo<AudioPlayerContextValue>(() => {
    return {
      state,
      queue: state.queue,
      currentTrack: state.currentIndex >= 0 ? state.queue[state.currentIndex] ?? null : null,
      actions: {
        loadQueue,
        playTrack,
        playAt: playTrackAt,
        togglePlay,
        playNext,
        playPrevious,
        seek,
        setVolume,
        setMode,
        openPanel,
        closePanel,
        togglePanel
      }
    }
  }, [state, closePanel, loadQueue, openPanel, playNext, playPrevious, playTrack, playTrackAt, seek, setMode, setVolume, togglePanel, togglePlay])

  return <AudioPlayerContext.Provider value={contextValue}>{children}</AudioPlayerContext.Provider>
}

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider')
  }
  return context
}
