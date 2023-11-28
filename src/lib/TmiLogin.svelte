<script lang="ts">
  import { useForm, Hint, validators, required } from 'svelte-use-form'
  import { createEventDispatcher } from 'svelte'
  import { type TmiLoginInfo } from '../types'

  export let error: string = ''

  const dispatch = createEventDispatcher<{ connect: TmiLoginInfo }>()

  const requiredMessage = 'This field is required'
  const form = useForm({
    username: { initial: '' },
    oauthToken: { initial: '' },
    channel: { initial: '' },
    remember: {},
  })

  const formSubmit = () => {
    if ($form.valid) {
      const username = $form.username.value
      const oauthToken = $form.oauthToken.value
      const channel = $form.channel.value
      const remember = $form.remember.value === 'checked'
      dispatch('connect', { username, oauthToken, channel, remember: remember })
    }
  }
</script>

<form use:form on:submit|preventDefault={formSubmit}>
  <label for="username">Username</label>
  <input type="text" name="username" use:validators={[required]} />
  <Hint for="username" on="required">{requiredMessage}</Hint>

  <label for="oauthToken">OAuth Token</label>
  <input type="password" name="oauthToken" use:validators={[required]} />
  <Hint for="oauthToken" on="required">{requiredMessage}</Hint>

  <label for="channel">Channel</label>
  <input type="text" name="channel" use:validators={[required]} />
  <Hint for="channel" on="required">{requiredMessage}</Hint>

  <label for="remember">Remember Login?</label>
  <input type="checkbox" name="remember" />

  {#if error}
    <p id="connectionerror">{error}</p>
  {/if}
  <button disabled={!$form.valid}>Connect</button>
</form>

<style>
  :global(.touched:invalid) {
    border-color: red;
    outline-color: red;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  #connectionerror {
    color: red;
  }
</style>
