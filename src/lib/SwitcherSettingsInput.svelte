<script lang="ts">
  import type { ObsScene } from '../types'
  import { sceneSwitchSettings } from '../store'
  import ValueSelect from './ValueSelect.svelte'

  export let scenes: ObsScene[]
  export let collections: string[]
</script>

<div class="settings">
  <ValueSelect
    label="IRL Collection"
    bind:selectedValue={$sceneSwitchSettings.collection}
    values={collections}
  />
  <ValueSelect
    label="Main Scene"
    bind:selectedValue={$sceneSwitchSettings.main}
    values={scenes.map((s) => s.sceneName)}
  />
  <ValueSelect
    label="Low Quality Scene"
    bind:selectedValue={$sceneSwitchSettings.lowQuality}
    values={scenes.map((s) => s.sceneName)}
  />
  <ValueSelect
    label="BRB Scene"
    bind:selectedValue={$sceneSwitchSettings.brb}
    values={scenes.map((s) => s.sceneName)}
  />
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
  div {
    display: flex;
    flex-direction: column;
  }
</style>
