import { get } from 'svelte/store'
import { obsConnected, startStream, stopStream, switchScene } from './obs'
import { botSettings, sceneSwitchSettings } from './store'
import type { ChatCommand, SrtStats } from './types'
import { isAllowedToRun } from './utils'
import { sendMessage } from './tmi'

export class Switcher {
  constructor() {}

  handleStats(stats: SrtStats | null) {
    if (!get(obsConnected)) return

    const settings = get(sceneSwitchSettings)

    let switchTo: string | null = null

    if (stats === null) {
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
      case 'start':
        startStream()
          .then(() => sendMessage(channel, 'Started stream!'))
          .catch(() => sendMessage(channel, 'Unable to start stream!'))
        break
      case 'stop':
        stopStream()
          .then(() => sendMessage(channel, 'Stopped stream!'))
          .catch(() => sendMessage(channel, 'Unable to stop stream!'))
        break
    }
  }
}
