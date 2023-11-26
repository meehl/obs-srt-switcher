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
  } from './obs'

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
    <button on:click={obsDisconnect}>Disconnect</button>
  {/if}
</main>

<style>
</style>
