import { createModel } from '@rematch/core'
import { RootModel } from './index'

type stateProps = {
  count: number
  msCookies: string | null
}

export const settings = createModel<RootModel>()({
  name: 'settings',
  state: {
    count: 0,
    msCookies: null,
  } as stateProps,

  reducers: {
    setMsCookies(state, payload: string) {
      state.msCookies = payload

      return {
        ...state,
      }
    },
    increment(state, payload: { count: number }) {
      state.count += payload.count

      return {
        ...state,
      }
    },
  },

  effects: dispatch => ({
    async incrementAsync(payload: { count: number }) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch.settings.increment(payload)
    },
  }),
})
