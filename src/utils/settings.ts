import SETTINGS from 'config'

import { IConfig } from '../types'

export const getSetting = <T extends keyof IConfig>(key: T) => {
  return SETTINGS.get<IConfig[T]>(key)
}
