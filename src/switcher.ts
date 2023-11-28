import { get } from 'svelte/store'
import { obsConnected, switchScene } from './obs'
import { sceneSwitchSettings } from './store'
import type { SrtStats } from './types'

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
}
