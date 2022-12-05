<script>
  import { i18n } from '../lib/i18n.js'
  import Preferences from './Preferences.svelte'
  import Capsules from './Capsules.svelte'
  import { getSettingStore } from '../lib/settings_store.js'
  import NavBar from './NavBar.svelte'

  // New tab: logs/opened lately, with the possibility to edit/delete/recreate capsules from those logs
  const tabs = [
    { key: 'preferences', label: i18n('Preferences') },
    { key: 'capsules', label: i18n('Capsules') },
  ]

  const selectedTab = getSettingStore('settings:selectedTab')

  let currentTab
  $: {
    currentTab = tabs.find(tab => tab.key === $selectedTab)
    document.title = `Time Capsule - ${currentTab.label}`
  }

  setTimeout(() => {
    const tabFromUrl = new URLSearchParams(window.location.search).get('tab')
    if (tabFromUrl) $selectedTab = tabFromUrl
  }, 200)
</script>

<NavBar>
  <div slot="start">
    {#each tabs as tab}
      <button
        on:click={() => $selectedTab = tab.key}
        class:active={tab.key === $selectedTab}
      >
        {tab.label}
      </button>
    {/each}
  </div>
</NavBar>

<div>
  {#if currentTab.key === 'preferences'}<Preferences />
  {:else if currentTab.key === 'capsules'}<Capsules />
  {/if}
</div>

<style>
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
