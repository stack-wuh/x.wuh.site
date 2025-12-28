import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import createPersistPlugin from '@rematch/persist'
import storage from 'redux-persist/lib/storage'
import immer from '@rematch/immer'
import { models, RootModel } from './models'

const persistConfig = {
  key: 'locale',
  keyPrefix: 'wuh.site:',
  version: 1,
  storage,
  serialize: true,
  whitelist: ['settings'],
}

export const store = init({
  models,
  plugins: [
    createPersistPlugin<unknown, RootModel>(persistConfig),
    immer({ whitelist: ['music', 'settings'] }),
  ] as any[],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
