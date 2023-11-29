<script lang="ts">
  import { botSettings } from '../store'
  import MultiStringInput from './MultiStringInput.svelte'
  import ToggleSwitch from './ToggleSwitch.svelte'
</script>

<div class="settings">
  <label for="allowMods">Allow Moderators</label>
  <ToggleSwitch id="allowMods" name="allowMods" bind:checked={$botSettings.allowModerators} />

  <label for="privilegedUsers">Privileged Users</label>
  <MultiStringInput bind:values={$botSettings.privilegedUsers} />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
