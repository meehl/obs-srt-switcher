import { writable } from 'svelte/store'
import OBSWebSocket from 'obs-websocket-js'
import { type ObsScene, type ObsLoginInfo } from './types'

export const obs = new OBSWebSocket()
export const obsConnected = writable(false)
export const obsConnectionError = writable('')
export const currentScene = writable('')
export const scenes = writable<ObsScene[]>([])

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

obs.on('ConnectionClosed', () => {
  obsConnected.set(false)
})

obs.on('ConnectionError', (event) => {
  console.error(event)
  obsConnected.set(false)
  obsConnectionError.set(event.message)
})

obs.on('Identified', () => {
  obs
    .call('GetSceneList')
    .then((sceneList) => {
      currentScene.set(sceneList.currentProgramSceneName)
      scenes.set(sceneList.scenes as ObsScene[])
    })
    .catch((e) => console.error(e))
})

obs.on('CurrentProgramSceneChanged', (event) => {
  currentScene.set(event.sceneName)
})

obs.on('SceneListChanged', (event) => {
  scenes.set(event.scenes as ObsScene[])
})

obs.on('SceneNameChanged', (event) => {
  currentScene.update((s) => {
    if (s === event.oldSceneName) {
      return event.sceneName
    } else {
      return s
    }
  })
})

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
