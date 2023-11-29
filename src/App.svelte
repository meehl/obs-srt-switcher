<script lang="ts" context="module">
  import { Switcher } from './switcher'
  import { SrtPoller, srtStats } from './srt'
  import { tmiCommand } from './tmi'
  import { srtSettings } from './store'
  import { currentCollection } from './obs'
  import { sceneSwitchSettings } from './store'
  import { get } from 'svelte/store'

  const switcher = new Switcher()
  srtStats.subscribe((stats) => {
    switcher.handleStats(stats)
  })
  tmiCommand.subscribe((command) => {
    switcher.handleChatCommand(command)
  })

  const srtPoller = new SrtPoller()
  srtSettings.subscribe((settings) => {
    srtPoller.updateSettings(settings)
  })

  currentCollection.subscribe((collection) => {
    if (collection === get(sceneSwitchSettings).collection) {
      srtPoller.start()
    } else {
      srtPoller.stop()
    }
  })

  sceneSwitchSettings.subscribe((sceneSettings) => {
    if (get(currentCollection) === sceneSettings.collection) {
      srtPoller.start()
    } else {
      srtPoller.stop()
    }
  })
</script>

<script lang="ts">
  import ObsLogin from './lib/ObsLogin.svelte'
  import TmiLogin from './lib/TmiLogin.svelte'
  import { type ObsLoginInfo, type TmiLoginInfo } from './types'
  import {
    obsConnected,
    obsConnectionError,
    obsConnect,
    obsDisconnect,
    currentScene,
    scenes,
    collections,
  } from './obs'
  import { tmiConnected, tmiConnectionError, tmiConnect, tmiDisconnect } from './tmi'
  import SceneSettingsInput from './lib/SceneSettingsInput.svelte'
  import SrtSettingsInput from './lib/SrtSettingsInput.svelte'
  import BotSettingsInput from './lib/BotSettingsInput.svelte'

  const handleObsLogin = (event: CustomEvent<ObsLoginInfo>) => {
    obsConnect(event.detail)
  }

  const handleTmiLogin = (event: CustomEvent<TmiLoginInfo>) => {
    tmiConnect(event.detail)
  }
</script>

<main>
  {#if !$obsConnected}
    <ObsLogin error={$obsConnectionError} on:connect={handleObsLogin} />
  {:else}
    <p>You are connected to OBS</p>
    <p>Current Scene: {$currentScene}</p>
    <p>Scenes: {$scenes.map((s) => s.sceneName).join(', ')}</p>
    <p>Current Collection: {$currentCollection}</p>
    <p>Collections: {$collections.join(', ')}</p>
    <SceneSettingsInput scenes={$scenes} collections={$collections} />
    <SrtSettingsInput />
    {#if !$tmiConnected}
      <TmiLogin error={$tmiConnectionError} on:connect={handleTmiLogin} />
    {:else}
      <BotSettingsInput />
      <button on:click={tmiDisconnect}>Disconnect</button>
    {/if}
    <p>{JSON.stringify($srtStats)}</p>
    <button on:click={obsDisconnect}>Disconnect</button>
  {/if}
</main>

<style>
</style>
