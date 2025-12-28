import { Models } from '@rematch/core'
import { settings } from './settings'
import { music } from './music'

export interface RootModel extends Models<RootModel> {
  settings: typeof settings,
  music: typeof music
}

export const models:RootModel = {
  settings,
  music
}