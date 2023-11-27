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
</div>

<style>
</style>
