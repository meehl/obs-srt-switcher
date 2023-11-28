import { writable, get } from 'svelte/store'
import type { BotSettings, SceneSwitchSettings, SrtSettings } from './types'

export const storedWritable = <T>(key: string, initialValue: T) => {
  const stored = localStorage.getItem(key)

  const w = writable<T>(stored ? JSON.parse(stored) : initialValue)

  const set = (...args: Parameters<typeof w.set>) => {
    w.set(...args)
    localStorage.setItem(key, JSON.stringify(get(w)))
  }

  const update = (...args: Parameters<typeof w.update>) => {
    w.update(...args)
    localStorage.setItem(key, JSON.stringify(get(w)))
  }

  const clear = () => {
    w.set(initialValue)
    localStorage.removeItem(key)
  }

  return {
    subscribe: w.subscribe,
    set,
    update,
    clear,
  }
}

export const sceneSwitchSettings = storedWritable<SceneSwitchSettings>('sceneSwitchSettings', {
  main: 'main',
  lowQuality: 'low_quality',
  brb: 'brb',
  rateThreshold: 0.5,
  rttThreshold: 1000,
})

export const srtSettings = storedWritable<SrtSettings>('srtSettings', {
  streamUrl: '',
  streamId: 'publish/test',
  pollingInterval: 5000,
})

export const botSettings = storedWritable<BotSettings>('botSettings', {
  allowModerators: false,
  privilegedUsers: [],
})
