<script>
  import CogIcon from '../icons/CogIcon.svelte'

  export let context = null

  function showSettings () {
    browser.tabs.create({ url: '/settings/settings.html' })
    if (context === 'popup') window.close()
  }
</script>

<button
  class="settings"
  class:in-popup={context === 'popup'}
  on:click={showSettings}
  >
  <CogIcon />
</button>

<style>
  .settings.in-popup{
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    border: 0;
  }
  button{
    width: 2em;
    height: 2em;
  }
  .settings:hover{
    background: none;
    opacity: 0.9;
  }
</style>
