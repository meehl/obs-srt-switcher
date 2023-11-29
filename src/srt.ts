import { writable } from 'svelte/store'
import type { SrtSettings, SrtSocket, SrtStats } from './types'

type TimeoutType = ReturnType<typeof setTimeout>

export const srtStats = writable<SrtStats | null>(null)

export class SrtPoller {
  pollTimer: TimeoutType | null
  streamUrl: string
  streamId: string
  pollingInterval: number

  constructor() {
    this.pollTimer = null
    this.streamUrl = ''
    this.streamId = ''
    this.pollingInterval = 0
  }

  updateSettings(srtSettings: SrtSettings) {
    this.streamUrl = srtSettings.streamUrl
    this.streamId = srtSettings.streamId
    this.pollingInterval = srtSettings.pollingInterval
  }

  start() {
    if (this.pollTimer) {
      this.stop()
    }

    if (!(this.streamUrl && this.streamId)) {
      return
    }

    this.poll()
  }

  stop() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer as TimeoutType)
      srtStats.set(null)
    }
  }

  poll() {
    this.fetchStats()
    this.pollTimer = setTimeout(this.poll.bind(this), this.pollingInterval)
  }

  fetchStats() {
    fetch(this.streamUrl)
      .then((resp) => resp.json())
      .then((stats: SrtSocket[]) => {
        const socket = stats.find((s) => s.stream_id === this.streamId)
        if (socket) {
          srtStats.set(socket.stats)
        } else {
          srtStats.set(null)
        }
      })
      .catch(() => {
        srtStats.set(null)
      })
  }
}
