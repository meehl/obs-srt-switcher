<script lang="ts">
  import type { ObsScene } from '../types'

  export let label: string
  export let selectedScene: string
  export let scenes: ObsScene[]
</script>

<label for="scene">{label}</label>
<select name="scene" bind:value={selectedScene}>
  {#if !scenes.some((s) => s.sceneName === selectedScene)}
    <option>{selectedScene}</option>
  {/if}
  {#each scenes as scene (scene.sceneName)}
    <option value={scene.sceneName}>{scene.sceneName}</option>
  {/each}
</select>
