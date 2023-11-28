import { get } from 'svelte/store'
import { obsConnected, switchScene } from './obs'
import { sceneSwitchSettings } from './store'
import type { SrtStats } from './types'

export class Switcher {
  constructor() {}

  handleStats(stats: SrtStats) {
    if (!get(obsConnected)) return

    const settings = get(sceneSwitchSettings)

    let switchTo: string | null = null

    if (stats === null) {
      switchTo = settings.brb
    } else {
      switchTo = settings.main
    }

    switchScene(switchTo).catch((e) => {
      console.error('Unable to automatically switch scenes! ', e)
    })
  }
}
