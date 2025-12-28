import React from 'react'
import { getLocaleId, isSafeAudio } from '@/lib/index'

let __audioInstance: HTMLAudioElement | null = null
const __id = getLocaleId()

const getAudioRef = (): HTMLAudioElement => {
  if (__audioInstance) {
    return __audioInstance
  }

  if (isSafeAudio()) {
    const instance = new Audio()
    __audioInstance = instance
    instance.setAttribute('data-stemp', __id)
    instance.setAttribute('id', `audio-${__id}`)
    instance.muted = false
    instance.volume = 1
    return instance
  }

  return {} as HTMLAudioElement
}
const audioInstanceRef = getAudioRef()
interface IAudio {
  audio: HTMLAudioElement
  actions: {
    setAttrubite(k: string, v?: any): void
    getAttrubite(k: string): any
    onToggleMuted(): boolean
  }
}

const AudioContext = React.createContext<IAudio>({
  audio: audioInstanceRef,
  actions: {
    setAttrubite() {},
    getAttrubite() {},
    onToggleMuted: () => false,
  },
})

const AudioProvider: React.FC<{}> = props => {
  const audioRef = React.useRef<HTMLAudioElement>(audioInstanceRef)

  const actions = {
    setAttrubite(k: string, v: string) {
      audioRef.current.setAttribute(k, v)
    },
    getAttrubite(k: string) {
      return audioRef.current.getAttribute(k)
    },
    onToggleMuted() {
      audioRef.current.muted = !audioRef.current.muted
      return audioRef.current.muted
    },
  }
  const contextValue = {
    audio: audioRef.current,
    actions,
  }

  return (
    <AudioContext.Provider value={contextValue}>
      {props.children}
    </AudioContext.Provider>
  )
}

export const useAudioContext = () => {
  const context = React.useContext(AudioContext)

  return context
}

export default AudioProvider
