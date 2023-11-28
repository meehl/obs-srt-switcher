<script lang="ts">
  export let values: string[] = []

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return
    const target = e.target as HTMLInputElement
    const value = target.value
    if (!value.trim()) return
    values = [...values, value]
    target.value = ''
  }

  const removeValue = (index: number) => {
    values = values.filter((_, i) => i !== index)
  }
</script>

<div class="container">
  {#each values as value, index}
    <div class="element">
      <span>{value}</span>
      <button class="delete_btn" on:click={() => removeValue(index)}> &times; </button>
    </div>
  {/each}
  <input on:keydown={handleKeyDown} type="text" placeholder="Press enter to add..." />
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
    padding-left: 4px;
    padding-right: 4px;
    column-gap: 8px;
    align-items: center;
    border-radius: 4px;
  }
  .element {
    display: inline-block;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 8px;
  }
  .delete_btn {
    display: inline-flex;
    border-radius: 9999px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    height: 8px;
    width: 8px;
    margin-left: 4px;
  }

  input {
    outline: 2px solid transparent;
    outline-offset: 2px;
    margin: 0px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-grow: 1;
  }
</style>
