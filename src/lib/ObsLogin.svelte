<script lang="ts">
  import { useForm, Hint, validators, required } from 'svelte-use-form'
  import { createEventDispatcher } from 'svelte'
  import { type ObsLoginInfo } from '../types'

  export let obsConnectionError: string

  const dispatch = createEventDispatcher<{ connect: ObsLoginInfo }>()

  const requiredMessage = 'This field is required'
  const form = useForm({
    ip: { initial: 'localhost' },
    port: { initial: '4455' },
    password: { initial: '' },
    remember: {},
  })

  const formSubmit = () => {
    if ($form.valid) {
      const url = `ws://${$form.ip.value}:${$form.port.value}`
      const password = $form.password.value
      const remember = $form.remember.value === 'checked'
      dispatch('connect', { url, password, remember: remember })
    }
  }
</script>

<form use:form on:submit|preventDefault={formSubmit}>
  <h1>OBS Websocket</h1>
  <p>Password can be found in OBS under Tools -> Websocket Server Settings -> Show Connect Info</p>

  <label for="ip">IP</label>
  <input type="text" name="ip" use:validators={[required]} />
  <Hint for="ip" on="required">{requiredMessage}</Hint>

  <label for="port">Port</label>
  <input type="number" name="port" min="1024" max="65535" use:validators={[required]} />
  <Hint for="port" on="required">{requiredMessage}</Hint>

  <label for="password">Password</label>
  <input type="password" name="password" use:validators={[required]} />
  <Hint for="password" on="required">{requiredMessage}</Hint>

  <label for="remember">Remember Login?</label>
  <input type="checkbox" name="remember" />

  {#if obsConnectionError}
    <p id="connectionerror">{obsConnectionError}</p>
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
