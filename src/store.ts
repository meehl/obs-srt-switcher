import { writable, get } from 'svelte/store'
import type { BotSettings, SceneSwitchSettings, SrtSettings, TmiLoginInfo } from './types'
import { parseBoolean, parseNumber } from './utils'

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

// set default values based on search params
const params = new URLSearchParams(window.location.search)

const tmiLoggedIn = localStorage.getItem('tmiLoginInfo') !== null
const tmiUsername = params.get('tmiuser')
const tmiToken = params.get('tmitoken')
const tmiChannel = params.get('tmichannel')
if (!tmiLoggedIn && tmiUsername && tmiToken && tmiChannel) {
  const tmiLoginInfo: TmiLoginInfo = {
    username: tmiUsername,
    oauthToken: tmiToken,
    channel: tmiChannel,
    remember: true,
  }
  localStorage.setItem('tmiLoginInfo', JSON.stringify(tmiLoginInfo))
}

export const sceneSwitchSettings = storedWritable<SceneSwitchSettings>('sceneSwitchSettings', {
  collection: 'irl',
  main: 'main',
  lowQuality: 'low_quality',
  brb: 'brb',
  rateThreshold: 0.5,
  rttThreshold: 1000,
})

export const srtSettings = storedWritable<SrtSettings>('srtSettings', {
  streamUrl: params.get('srturl') ?? '',
  streamId: params.get('srtid') ?? 'publish/test',
  pollingInterval: parseNumber(params.get('srtpoll') ?? '') ?? 5000,
})

export const botSettings = storedWritable<BotSettings>('botSettings', {
  allowModerators: parseBoolean(params.get('botallowmods') ?? '') ?? false,
  privilegedUsers: params.getAll('botadmins'),
})
