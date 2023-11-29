<script lang="ts">
  export let id: string
  export let name: string | undefined = undefined
  export let checked: boolean = false
</script>

<div>
  <label for={id} style:background={checked ? '#4338ca' : undefined}>
    <input type="checkbox" {id} {name} bind:checked />
    <span
      style:transform={checked ? 'translateX(100%)' : ''}
      style:left={checked ? 'calc(100%-3px)' : ''}
    />
  </label>
</div>

<style>
  label {
    background-color: rgb(60, 64, 75);
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 2.5rem;
    height: 1.5rem;
    border-radius: 1.5rem;
    position: relative;
  }

  input {
    position: absolute;
    width: 0px;
    height: 0px;
    visibility: hidden;
  }

  span {
    width: 1rem;
    height: 1rem;
    background-color: white;
    position: absolute;
    top: 4px;
    left: 4px;
    border-radius: 1.5rem;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
    transition-duration: 150ms;
    content: none;
  }
</style>
