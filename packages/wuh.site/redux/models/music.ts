import { createModel } from '@rematch/core'
import { RootModel } from '.'
import fetcher from '@/lib/fetch'
import * as api from '@/constant/api'

export type TTraceItem = {
  name: string
  id: number
  author: string
  picUrl: string
  url: string
}

export type TCurrentProps = {
  name: string
  coverImgUrl: string
  created_at: string
  id: number
  playCount: number
  updateTime: number
  updated_at: string
  userId: number
  tracks: TTraceItem[]
}

export type TTrack = {
  /** 是否可以播放 */
  canplay: boolean
  /** 当前语音的播放状态 */
  audioStatus: 'ready' | 'pedding' | 'playing' | 'paused' | 'ended'
  /** 音频总长 s */
  duration: number
  /** 当前播放进度 s */
  currentTime: number
  /** 进度条数据 % */
  procent: number
  /** 是否禁用声音 */
  muted: boolean
}

export type TMusicProps = {
  current: TCurrentProps
  index: number
  player: {
    url: string
    [key: string]: any
  }
  track: TTrack
}

export const music = createModel<RootModel>()({
  name: 'music',
  state: {
    current: {},
    player: {},
    index: 0,
    track: {
      audioStatus: 'pedding',
      canplay: false,
      duration: 0,
      currentTime: 0,
      procent: 0,
      muted: true,
    },
  } as TMusicProps,

  reducers: {
    resetPlayList(state, payload) {
      state.current = payload

      return state
    },

    resetPlayerURL(state, payload) {
      state.player = payload

      return state
    },

    resetPlayTrack(state, payload: TTrack) {
      Object.assign(state, { track: payload })

      return state
    },
  },

  effects: dispatch => ({
    /**
     * 查询全部播放列表
     */
    async loadMusicData() {
      const res = await fetcher(api.API_PLAY_LIST)
      dispatch.music.resetPlayList(res.hits)
    },

    async loadPlayerURL(payload, rootState) {
      const { id } = payload
      const { id: sid } = rootState.music.current
      const res = await fetcher(`${api.API_PLAY_ITEM}/${sid}/${id}`)
      const item = {
        ...res.data.data[0],
        cookie: res.cookie,
      }
      dispatch.music.resetPlayerURL(item)
    },

    async putChangeTrack(payload) {
      dispatch.music.resetPlayTrack(payload)
    },
  }),
})
