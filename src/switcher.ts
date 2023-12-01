import { get } from 'svelte/store'
import {
  obsConnected,
  startStream,
  stopStream,
  switchScene,
  switchCollection,
  collections,
  scenes,
  currentCollection,
  currentScene,
} from './obs'
import { botSettings, sceneSwitchSettings } from './store'
import type { ChatCommand, SrtStats } from './types'
import { isAllowedToRun, parseBoolean, parseNumber } from './utils'
import { sendMessage } from './tmi'
import { srtStats } from './srt'

export class Switcher {
  forceBrb: boolean

  constructor() {
    this.forceBrb = false
  }

  handleStats(stats: SrtStats | null) {
    if (!get(obsConnected)) return

    const settings = get(sceneSwitchSettings)

    let switchTo: string | null = null

    if (this.forceBrb) {
      switchTo = settings.brb
    } else if (stats === null) {
      switchTo = settings.brb
    } else if (stats.MbpsRecvRate < settings.rateThreshold) {
      console.log(`Low SendRate detected: ${stats.MbpsRecvRate}Mb/s`)
      switchTo = settings.lowQuality
    } else if (stats.MsRTT > settings.rttThreshold) {
      console.log(`High RTT detected: ${stats.MsRTT}ms`)
      switchTo = settings.lowQuality
    } else {
      switchTo = settings.main
    }

    switchScene(switchTo).catch((e) => {
      console.error('Unable to automatically switch scenes! ', e)
    })
  }

  handleChatCommand(command?: ChatCommand) {
    if (!command || !isAllowedToRun(command.sender, get(botSettings))) return
    const channel = command.channel

    switch (command.type) {
      case 'start': {
        startStream()
          .then(() => sendMessage(channel, 'Started stream!'))
          .catch(() => sendMessage(channel, 'Unable to start stream!'))
        break
      }
      case 'stop': {
        stopStream()
          .then(() => sendMessage(channel, 'Stopped stream!'))
          .catch(() => sendMessage(channel, 'Unable to stop stream!'))
        break
      }
      case 'collections': {
        sendMessage(channel, `Available collections: ${get(collections).join(', ')}`)
        break
      }
      case 'scenes': {
        sendMessage(
          channel,
          `Available scenes: ${get(scenes)
            .map((s) => s.sceneName)
            .join(', ')}`,
        )
        break
      }
      case 'collection': {
        const collectionName = command.args.join(' ')
        if (collectionName) {
          switchCollection(collectionName)
            .then(() => sendMessage(channel, `Switched collection to: ${collectionName}`))
            .catch(() => sendMessage(channel, 'Unable to switch collection!'))
        } else {
          sendMessage(channel, `Current collection: ${get(currentCollection)}`)
        }
        break
      }
      case 'scene': {
        const sceneName = command.args.join(' ')
        if (sceneName) {
          switchScene(sceneName)
            .then(() => sendMessage(channel, `Switched scene to: ${sceneName}`))
            .catch(() => sendMessage(channel, 'Unable to switch scene!'))
        } else {
          sendMessage(channel, `Current scene: ${get(currentScene)}`)
        }
        break
      }
      case 'sw_col': {
        const collection = command.args.join(' ')
        if (collection) {
          sceneSwitchSettings.update((s) => ({ ...s, collection }))
          sendMessage(channel, `Set srt collection to: ${collection}`)
        } else {
          sendMessage(channel, `Current srt collection: ${get(sceneSwitchSettings).collection}`)
        }
        break
      }
      case 'sw_main': {
        const main = command.args.join(' ')
        if (main) {
          sceneSwitchSettings.update((s) => ({ ...s, main }))
          sendMessage(channel, `Set main scene to: ${main}`)
        } else {
          sendMessage(channel, `Current main scene: ${get(sceneSwitchSettings).main}`)
        }
        break
      }
      case 'sw_lq': {
        const low_quality = command.args.join(' ')
        if (low_quality) {
          sceneSwitchSettings.update((s) => ({ ...s, low_quality }))
          sendMessage(channel, `Set low quality scene to: ${low_quality}`)
        } else {
          sendMessage(channel, `Current low quality scene: ${get(sceneSwitchSettings).lowQuality}`)
        }
        break
      }
      case 'sw_brb': {
        const brb = command.args.join(' ')
        if (brb) {
          sceneSwitchSettings.update((s) => ({ ...s, brb }))
          sendMessage(channel, `Set brb scene to: ${brb}`)
        } else {
          sendMessage(channel, `Current brb scene: ${get(sceneSwitchSettings).brb}`)
        }
        break
      }
      case 'sw_rate': {
        const value = parseNumber(command.args[0])
        if (value) {
          sceneSwitchSettings.update((s) => ({ ...s, rateThreshold: value }))
          sendMessage(channel, `Set rate threshold to: ${value}Mb/s`)
        } else {
          sendMessage(
            channel,
            `Current rate threshold: ${get(sceneSwitchSettings).rateThreshold}Mb/s`,
          )
        }
        break
      }
      case 'sw_rtt': {
        const value = parseNumber(command.args[0])
        if (value) {
          sceneSwitchSettings.update((s) => ({ ...s, rttThreshold: value }))
          sendMessage(channel, `Set rtt threshold to: ${value}Mb/s`)
        } else {
          sendMessage(
            channel,
            `Current rtt threshold: ${get(sceneSwitchSettings).rttThreshold}Mb/s`,
          )
        }
        break
      }
      case 'forcebrb': {
        const mode = parseBoolean(command.args[0])
        if (mode === undefined) {
          sendMessage(channel, `Current forceBrb mode: ${this.forceBrb ? 'on' : 'off'}`)
        } else {
          this.forceBrb = mode
          sendMessage(channel, `Set forceBrb to: ${mode ? 'on' : 'off'}`)
        }
        break
      }
      case 'stats': {
        const stats = get(srtStats)
        if (stats) {
          const bitrate = stats.MbpsRecvRate.toFixed(2)
          const rtt = stats.MsRTT.toFixed(2)
          sendMessage(channel, `Bitrate: ${bitrate}Mb/s | RTT: ${rtt}ms`)
        } else {
          sendMessage(channel, 'Stats not available!')
        }
        break
      }
    }
  }
}
