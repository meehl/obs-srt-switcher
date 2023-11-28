import { writable } from 'svelte/store'
import type { SrtSettings, SrtSocket, SrtStats } from './types'
import { srtSettings } from './store'

type TimeoutType = ReturnType<typeof setTimeout>

export const srtStats = writable<SrtStats | null>(null)

let pollTimer: TimeoutType | null

const getStats = (streamUrl: string, streamId: string) => {
  fetch(streamUrl)
    .then((resp) => resp.json())
    .then((stats: SrtSocket[]) => {
      const socket = stats.find((s) => s.stream_id === streamId)
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

const start = (srtSettings: SrtSettings) => {
  if (pollTimer) {
    stop()
  }

  if (!(srtSettings.streamUrl && srtSettings.streamId)) {
    return
  }

  getStats(srtSettings.streamUrl, srtSettings.streamId)
  pollTimer = setInterval(
    getStats,
    srtSettings.pollingInterval,
    srtSettings.streamUrl,
    srtSettings.streamId,
  )

  console.log('Started polling with: ', srtSettings)
}

const stop = () => {
  if (pollTimer) {
    clearTimeout(pollTimer as TimeoutType)
  }
  srtStats.set(null)
  console.log('Stopped polling')
}

srtSettings.subscribe((settings) => {
  start(settings)
})
