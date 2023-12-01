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
    scenes,
    collections,
  } from './obs'
  import { tmiConnected, tmiConnectionError, tmiConnect, tmiDisconnect } from './tmi'
  import SwitcherSettingsInput from './lib/SwitcherSettingsInput.svelte'
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
    <div>
      <p>
        SRT Status:
        {#if $srtStats}
          <span style="color: green;">Online</span>
          ({$srtStats.MbpsRecvRate.toFixed(2)}Mb/s | {$srtStats.MsRTT.toFixed(2)}ms)
        {:else}
          <span style="color: red;">Offline</span>
        {/if}
      </p>
    </div>
    <details>
      <summary>Switcher Settings</summary>
      <SwitcherSettingsInput scenes={$scenes} collections={$collections} />
    </details>
    <details>
      <summary>SRT Settings</summary>
      <SrtSettingsInput />
    </details>
    <details>
      <summary>Chatbot Settings</summary>
      {#if !$tmiConnected}
        <TmiLogin error={$tmiConnectionError} on:connect={handleTmiLogin} />
      {:else}
        <BotSettingsInput />
        <button on:click={tmiDisconnect}>Chat Disconnect</button>
      {/if}
    </details>
    <button on:click={obsDisconnect}>OBS Disconnect</button>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }

  details {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
    padding: 4px 2px;
  }

  details summary {
    font-size: 13pt;
    cursor: pointer;
    margin-bottom: 4px;
  }
</style>
