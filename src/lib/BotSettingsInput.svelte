<script lang="ts">
  import { botSettings } from '../store'
  import MultiStringInput from './MultiStringInput.svelte'
</script>

<div>
  <label for="allowMods">Allow Moderators</label>
  <input type="checkbox" name="allowMods" bind:checked={$botSettings.allowModerators} />

  <label for="privilegedUsers">Privileged Users</label>
  <MultiStringInput bind:values={$botSettings.privilegedUsers} />
</div>

<style>
</style>
