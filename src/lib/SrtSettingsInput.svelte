<script lang="ts">
  import { useForm, Hint, validators, required } from 'svelte-use-form'
  import { srtSettings } from '../store'

  const requiredMessage = 'This field is required'
  const form = useForm({
    streamUrl: { initial: $srtSettings.streamUrl },
    streamId: { initial: $srtSettings.streamId },
    pollingInterval: { initial: $srtSettings.pollingInterval.toString() },
    remember: {},
  })

  const formSubmit = () => {
    if ($form.valid) {
      const streamUrl = $form.streamUrl.value
      const streamId = $form.streamId.value
      const pollingInterval = Number($form.pollingInterval.value)
      srtSettings.set({ streamUrl, streamId, pollingInterval })
    }
  }
</script>

<form use:form on:submit|preventDefault={formSubmit}>
  <label for="streamUrl">Stream URL</label>
  <input type="text" name="streamUrl" use:validators={[required]} />
  <Hint for="streamUrl" on="required">{requiredMessage}</Hint>

  <label for="streamId">Stream ID</label>
  <input type="text" name="streamId" use:validators={[required]} />
  <Hint for="streamId" on="required">{requiredMessage}</Hint>

  <label for="pollingInterval">Polling Interval (ms)</label>
  <input type="number" name="pollingInterval" use:validators={[required]} />
  <Hint for="pollingInterval" on="required">{requiredMessage}</Hint>

  <button disabled={!$form.valid}>Apply</button>
</form>

<style>
</style>
