import { writable, get } from 'svelte/store'
import OBSWebSocket from 'obs-websocket-js'
import { type ObsScene, type ObsLoginInfo } from './types'

export const obs = new OBSWebSocket()
export const obsConnected = writable(false)
export const obsConnectionError = writable('')
export const currentScene = writable('')
export const scenes = writable<ObsScene[]>([])
export const currentCollection = writable('')
export const collections = writable<string[]>([])

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
      })
  }
}
autoLogin()

obs.on('ConnectionClosed', () => {
  console.error('OBS connection closed!')
  obsConnected.set(false)
})

obs.on('ConnectionError', (event) => {
  console.error(event)
  obsConnected.set(false)
  obsConnectionError.set(event.message)
})

const updateSceneList = () => {
  obs
    .call('GetSceneList')
    .then((sceneList) => {
      currentScene.set(sceneList.currentProgramSceneName)
      scenes.set(sceneList.scenes as ObsScene[])
    })
    .catch((e) => console.error(e))
}

const updateCollectionList = () => {
  obs
    .call('GetSceneCollectionList')
    .then((collectionList) => {
      currentCollection.set(collectionList.currentSceneCollectionName)
      collections.set(collectionList.sceneCollections)
    })
    .catch((e) => console.error(e))
}

obs.on('Identified', () => {
  updateSceneList()
  updateCollectionList()
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

obs.on('CurrentSceneCollectionChanged', (event) => {
  currentCollection.set(event.sceneCollectionName)
  // SceneListChanged and CurrentProgramSceneChanged are not emitted
  // on collection change so update manually
  updateSceneList()
})

obs.on('SceneCollectionListChanged', (event) => {
  collections.set(event.sceneCollections)
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

export const switchScene = (sceneName: string) => {
  return new Promise<void>((resolve, reject) => {
    if (sceneName === get(currentScene)) {
      resolve()
    } else {
      obs
        .call('SetCurrentProgramScene', { sceneName })
        .then(() => {
          console.log(`Switched current scene to ${sceneName}`)
          resolve()
        })
        .catch((e) => {
          console.error(e)
          reject(e)
        })
    }
  })
}

export const switchCollection = (sceneCollectionName: string) => {
  return new Promise<void>((resolve, reject) => {
    if (sceneCollectionName === get(currentCollection)) {
      resolve()
    } else {
      obs
        .call('SetCurrentSceneCollection', { sceneCollectionName })
        .then(() => {
          console.log(`Switched current collection to ${sceneCollectionName}`)
          resolve()
        })
        .catch((e) => {
          console.error(e)
          reject()
        })
    }
  })
}

export const startStream = () => {
  return obs.call('StartStream')
}

export const stopStream = () => {
  return obs.call('StopStream')
}
