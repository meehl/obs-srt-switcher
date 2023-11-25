import { writable } from 'svelte/store'
import OBSWebSocket from 'obs-websocket-js'
import type { ObsLoginInfo } from './types'

export const obs = new OBSWebSocket()
export const obsConnected = writable(false)
export const obsConnectionError = writable('')

const autoLogin = async () => {
  const savedLogin = localStorage.getItem('obsLoginInfo')
  if (savedLogin) {
    const loginInfo = JSON.parse(savedLogin)
    obs
      .connect(loginInfo.url, loginInfo.password)
      .then(() => {
        obsConnected.set(true)
      })
      .catch((e) => {
        obsConnectionError.set(e.message || 'Unable to connect to OBS Websocket')
        localStorage.removeItem('obsLoginInfo')
      })
  }
}
autoLogin()

export const obsConnect = (loginInfo: ObsLoginInfo) => {
  obs
    .connect(loginInfo.url, loginInfo.password)
    .then(() => {
      obsConnected.set(true)
      obsConnectionError.set('')
      if (loginInfo.remember) {
        localStorage.setItem(
          'obsLoginInfo',
          JSON.stringify({ url: loginInfo.url, password: loginInfo.password }),
        )
      }
    })
    .catch((e) => {
      console.log(e.message)
      obsConnectionError.set(e.message || 'Unable to connect to OBS Websocket')
      obsConnected.set(false)
    })
}

export const obsDisconnect = () => {
  obs
    .disconnect()
    .then(() => {
      obsConnected.set(false)
      localStorage.removeItem('obsLoginInfo')
    })
    .catch((e) => {
      console.error(e)
    })
}
