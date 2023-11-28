<script lang="ts" context="module">
  import { Switcher } from './switcher'
  import { srtStats, startPolling } from './srt'
  import { srtSettings } from './store'

  const switcher = new Switcher()
  srtStats.subscribe((stats) => {
    switcher.handleStats(stats)
  })

  srtSettings.subscribe((settings) => {
    startPolling(settings)
  })
</script>

<script lang="ts">
  import ObsLogin from './lib/ObsLogin.svelte'
  import { type ObsLoginInfo } from './types'
  import {
    obsConnected,
    obsConnectionError,
    obsConnect,
    obsDisconnect,
    currentScene,
    scenes,
    currentCollection,
    collections,
  } from './obs'
  import SceneSettingsInput from './lib/SceneSettingsInput.svelte'
  import SrtSettingsInput from './lib/SrtSettingsInput.svelte'

  const handleLogin = (event: CustomEvent<ObsLoginInfo>) => {
    obsConnect(event.detail)
  }
</script>

<main>
  {#if !$obsConnected}
    <ObsLogin obsConnectionError={$obsConnectionError} on:connect={handleLogin} />
  {:else}
    <p>You are connected to OBS</p>
    <p>Current Scene: {$currentScene}</p>
    <p>Scenes: {$scenes.map((s) => s.sceneName).join(', ')}</p>
    <p>Current Collection: {$currentCollection}</p>
    <p>Collections: {$collections.join(', ')}</p>
    <SceneSettingsInput scenes={$scenes} />
    <SrtSettingsInput />
    <p>{JSON.stringify($srtStats)}</p>
    <button on:click={obsDisconnect}>Disconnect</button>
  {/if}
</main>

<style>
</style>
