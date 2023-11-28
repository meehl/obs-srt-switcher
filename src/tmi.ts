import tmi from 'tmi.js'
import type { TmiLoginInfo } from './types'
import { writable } from 'svelte/store'

let client: tmi.Client | null = null
export const tmiConnected = writable<boolean>(false)
export const tmiConnectionError = writable<string>('')

export const tmiConnect = (loginInfo: TmiLoginInfo) => {
  client = new tmi.Client({
    identity: {
      username: loginInfo.username,
      password: loginInfo.oauthToken,
    },
    channels: [loginInfo.channel],
    options: {
      skipMembership: true,
      skipUpdatingEmotesets: true,
      updateEmotesetsTimer: 0,
    },
  })

  client
    .connect()
    .then(() => {
      console.log('Connected to Twitch Chat')
      tmiConnected.set(true)
      tmiConnectionError.set('')

      if (loginInfo.remember) {
        localStorage.setItem('tmiLoginInfo', JSON.stringify(loginInfo))
      }

      client!.on('message', (channel, tags, message, self) => {
        console.log('Got new message! ', message)
      })
    })
    .catch((e: string) => {
      console.error(e)
      client = null
      tmiConnected.set(false)
      tmiConnectionError.set(e)
    })
}

export const tmiDisconnect = () => {
  client
    ?.disconnect()
    .then(() => {
      client = null
      tmiConnected.set(false)
      localStorage.removeItem('tmiLoginInfo')
    })
    .catch((e) => console.error(e))
}

const autoLogin = async () => {
  const savedLogin = localStorage.getItem('tmiLoginInfo')
  if (savedLogin) {
    const loginInfo = JSON.parse(savedLogin)
    tmiConnect({ ...loginInfo, remember: false })
  }
}
autoLogin()
