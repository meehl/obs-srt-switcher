<script lang="ts">
  import type { ObsScene } from '../types'
  import { sceneSwitchSettings } from '../store'
  import SceneSelect from './SceneSelect.svelte'

  export let scenes: ObsScene[]
</script>

<div>
  <SceneSelect label="Main Scene" bind:selectedScene={$sceneSwitchSettings.main} {scenes} />
  <SceneSelect
    label="Low Quality Scene"
    bind:selectedScene={$sceneSwitchSettings.lowQuality}
    {scenes}
  />
  <SceneSelect label="BRB Scene" bind:selectedScene={$sceneSwitchSettings.brb} {scenes} />
  <label for="rateThreshold">Rate Threshold (Mb/s)</label>
  <input
    type="number"
    name="rateThreshold"
    min="0"
    step="0.1"
    bind:value={$sceneSwitchSettings.rateThreshold}
  />
  <label for="rttThreshold">RTT Threshold (ms)</label>
  <input type="number" name="rttThreshold" min="0" bind:value={$sceneSwitchSettings.rttThreshold} />
</div>

<style>
</style>
