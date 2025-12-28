import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMount, useUpdateEffect, useEventListener } from 'ahooks'
import { useAudioContext } from './AudioProvider'
import { RootModel } from '@/redux/models'
import { TMusicProps } from '@/redux/models/music'

type TActionsProps = {
  onPlay: () => void
  onPause: () => void
  onTogglePlay: () => void
  onFetchPlayer: (p: { id: number }) => void
  onToggleMuted: () => void
}

type TOptions = {
  allowFetchList?: boolean
  [k: string]: unknown
}

const options: TOptions = {
  allowFetchList: true,
}

const useControl = (ops?: TOptions): [HTMLAudioElement, TActionsProps] => {
  const initOps = { ...options, ops }
  const { audio: audioRef, actions: audioActions } = useAudioContext()
  const dispatch = useDispatch()
  const store = useSelector((state: RootModel) => state.music)
  const { player, track } = store as unknown as TMusicProps

  useMount(() => {
    if (initOps.allowFetchList) {
      dispatch.music.loadMusicData()
    }
  })

  useUpdateEffect(() => {
    if (audioRef && player) {
      audioRef.src = player.url
      audioRef.ariaLabel = player.id
      if (track) {
        const _track = {
          ...track,
          audioStatus: 'pedding',
          canplay: false,
        }
        dispatch.music.putChangeTrack(_track)
      }
    }
  }, [player.url])

  useEventListener(
    'loadeddata',
    () => {
      if (track) {
        const _track = {
          ...track,
          audioStatus: 'ready',
          canplay: false,
        }
        dispatch.music.putChangeTrack(_track)
      }
      console.log('第一帧加载完成')
    },
    { target: audioRef }
  )

  useEventListener(
    'canplaythrough',
    () => {
      if (track) {
        const _track = {
          ...track,
          audioStatus: 'ready',
          canplay: true,
        }
        dispatch.music.putChangeTrack(_track)
      }
      console.log('可以播放')
    },
    { target: audioRef }
  )

  useEventListener(
    'ended',
    () => {
      if (track) {
        const _track = {
          ...track,
          audioStatus: 'endding',
          canplay: true,
        }
        dispatch.music.putChangeTrack(_track)
      }
      console.log('播放结束了')
    },
    { target: audioRef }
  )

  useEventListener(
    'durationchange',
    () => {
      console.log('==== durationchange', audioRef)
      if (audioRef) {
        const { duration, currentTime } = audioRef
        actions.onProcessChange(duration, currentTime)
      }
    },
    { target: audioRef }
  )

  useEventListener(
    'timeupdate',
    () => {
      if (audioRef) {
        const { duration, currentTime } = audioRef
        const __track = { ...track }
        __track.audioStatus = 'playing'
        __track.currentTime = currentTime
        __track.duration = duration
        const process = actions.onProcessChange(duration, currentTime)
        __track.procent = process.procent
        dispatch.music.putChangeTrack(__track)
      }
    },
    { target: audioRef }
  )

  const actions = React.useMemo(
    () => ({
      onPlay() {
        const __track = { ...track }
        __track.audioStatus = 'playing'
        audioRef.play()
        setTimeout(() => {
          dispatch.music.putChangeTrack(__track)
        })
      },
      onPause() {
        const __track = { ...track }
        __track.audioStatus = 'paused'
        audioRef.pause()
        setTimeout(() => {
          dispatch.music.putChangeTrack(__track)
        })
      },
      onTogglePlay() {},
      onFetchPlayer(option: { id: number }) {
        dispatch.music.loadPlayerURL({ id: option.id })
      },
      onProcessChange(
        duration: number,
        currentTime: number
      ): { procent: number; duration: number; currentTime: number } {
        const procent = Math.floor((currentTime / duration) * 100) || 0

        const progress = {
          procent,
          duration,
          currentTime,
        }

        return progress
      },
      onToggleMuted() {
        const val = audioActions.onToggleMuted()
        const __track = { ...track }
        __track.muted = val
        dispatch.music.putChangeTrack(__track)
      },
    }),
    []
  )

  return [audioRef, actions]
}

export default useControl
