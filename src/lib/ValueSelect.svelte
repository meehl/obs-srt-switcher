<script lang="ts">
  export let label: string
  export let selectedValue: string
  export let values: string[]
</script>

<label for="scene">{label}</label>
<select name="scene" bind:value={selectedValue}>
  {#if !values.some((v) => v === selectedValue)}
    <option>{selectedValue}</option>
  {/if}
  {#each values as value}
    <option {value}>{value}</option>
  {/each}
</select>
