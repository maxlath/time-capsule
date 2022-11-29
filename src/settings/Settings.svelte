<script>
  import { i18n } from '../lib/i18n.js'
  import Preferences from './Preferences.svelte'
  import Capsules from './Capsules.svelte'

  const tabs = [
    { key: 'capsules', label: i18n('Capsules') },
    { key: 'preferences', label: i18n('Preferences') },
  ]

  let currentTab = tabs[0]
</script>

<nav>
  <img class="logo" src="/icons/time-capsule-32.png" alt="logo" />
  {#each tabs as tab}
    <button on:click={() => currentTab = tab} class:active={currentTab === tab}>{tab.label}</button>
  {/each}
</nav>

<div>
  {#if currentTab.key === 'preferences'}<Preferences />
  {:else if currentTab.key === 'capsules'}<Capsules />
  {/if}
</div>

<style>
  nav{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }
  .logo{
    margin: 0.8em 1em;
  }
  button{
    padding: 1rem;
    align-self: stretch;
    font-size: 1rem;
    border-bottom: 3px solid transparent;
    transition: all 0.25s ease;
  }
  .active, button:hover{
    border-bottom: 3px solid var(--active-settings-tab);
    color: var(--active-settings-tab);
  }
</style>
