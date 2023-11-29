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
    background-color: rgb(60, 64, 75);
    display: flex;
    flex-wrap: wrap;
    padding: 2px 8px;
    column-gap: 8px;
    align-items: center;
    border-radius: 4px;
  }
  .element {
    background-color: rgb(43, 46, 56);
    display: inline-block;
    padding: 0px 8px;
    border-radius: 8px;
  }
  .delete_btn {
    background-color: rgb(43, 46, 56);
    display: inline-flex;
    border-radius: 9999px;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    height: 12px;
    width: 12px;
  }

  input {
    outline: 0px solid transparent;
    outline-offset: 2px;
    margin: 0px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-grow: 1;
  }
</style>
