import { writable, get } from 'svelte/store'
import type { SceneSwitchSettings } from './types'

export const storedWritable = <T>(key: string, initialValue: T) => {
  const stored = localStorage.getItem(key)

  const w = writable<T>(stored ? JSON.parse(stored) : initialValue)

  const set = (...args: Parameters<typeof w.set>) => {
    console.log(`Settings local store: ${key}`)
    w.set(...args)
    localStorage.setItem(key, JSON.stringify(get(w)))
  }

  const update = (...args: Parameters<typeof w.update>) => {
    console.log(`Updating local store: ${key}`)
    w.update(...args)
    localStorage.setItem(key, JSON.stringify(get(w)))
  }

  const clear = () => {
    console.log(`Clearing local store: ${key}`)
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
})
