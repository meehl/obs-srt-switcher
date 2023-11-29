<script lang="ts">
  import { srtSettings } from '../store'
</script>

<div class="settings">
  <label for="streamUrl">Stream URL</label>
  <input type="text" name="streamUrl" bind:value={$srtSettings.streamUrl} />

  <label for="streamId">Stream ID</label>
  <input type="text" name="streamId" bind:value={$srtSettings.streamId} />

  <label for="pollingInterval">Polling Interval (ms)</label>
  <input type="number" name="pollingInterval" bind:value={$srtSettings.pollingInterval} />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
</style>
