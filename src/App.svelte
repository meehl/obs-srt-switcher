<script lang="ts">
  import ObsLogin from './lib/ObsLogin.svelte'
  import { type ObsLoginInfo } from './types'
  import { obsConnected, obsConnectionError, obsConnect, obsDisconnect } from './obs'

  const handleLogin = (event: CustomEvent<ObsLoginInfo>) => {
    obsConnect(event.detail)
  }
</script>

<main>
  {#if !$obsConnected}
    <ObsLogin obsConnectionError={$obsConnectionError} on:connect={handleLogin} />
  {:else}
    <p>You are connected to OBS</p>
    <button on:click={obsDisconnect}>Disconnect</button>
  {/if}
</main>

<style>
</style>
