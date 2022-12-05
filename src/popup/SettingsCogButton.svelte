<script>
  export let context
  import { usesDarkMode } from '../lib/utils.js'

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
  {#if usesDarkMode()}
    <img src="/icons/cog-light.svg" alt="settings icon" />
  {:else}
    <img src="/icons/cog.svg" alt="settings icon" />
  {/if}
</button>

<style>
  .settings.in-popup{
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    border: 0;
  }
  .settings img{
    width: 1.6em;
    height: 1.6em;
  }
  .settings:hover{
    background: none;
    opacity: 0.9;
  }
</style>
