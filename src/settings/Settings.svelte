<script>
  import { i18n } from '../lib/i18n.js'
  import Preferences from './Preferences.svelte'
  import Capsules from './Capsules.svelte'
  import { getSettingStore, getSettingValue } from '../lib/settings_store.js'
  import NavBar from './NavBar.svelte'
  import Logs from './Logs.svelte'
  import Schedule from './Schedule.svelte'
  import { onChange } from '../lib/svelte.js'
  import Flash from '../popup/Flash.svelte'

  // New tab: logs/opened lately, with the possibility to edit/delete/recreate capsules from those logs
  const tabs = [
    { key: 'preferences', label: i18n('Preferences') },
    { key: 'schedule', label: i18n('Schedule') },
    { key: 'capsules', label: i18n('Capsules') },
    { key: 'logs', label: i18n('Logs') },
  ]

  let currentTab, flash

  function initTab (lastSelectedTab) {
    const tabFromUrl = new URLSearchParams(window.location.search).get('tab')
    const tabKey = tabFromUrl || lastSelectedTab
    currentTab = tabs.find(tab => tab.key === tabKey)
    document.title = `Time Capsule - ${currentTab.label}`
  }

  getSettingValue('settings:selectedTab')
  .then(initTab)
  .catch(err => flash = err)

  const selectedTabStore = getSettingStore('settings:selectedTab')
  function updateLastSelectedTab () {
    if (currentTab) {
      $selectedTabStore = currentTab.key
    }
  }

  $: onChange(currentTab, updateLastSelectedTab)
</script>

<Flash state={flash} />

<NavBar>
  <div slot="start">
    {#each tabs as tab}
      <button
        on:click={() => currentTab = tab}
        class:active={tab.key === currentTab?.key}
      >
        {tab.label}
      </button>
    {/each}
  </div>
</NavBar>

<div class="settings">
  {#if currentTab}
    {#if currentTab.key === 'preferences'}<Preferences />
    {:else if currentTab.key === 'capsules'}<Capsules />
    {:else if currentTab.key === 'schedule'}<Schedule />
    {:else if currentTab.key === 'logs'}<Logs />
    {/if}
  {/if}
</div>

<style>
  :global(main){
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
  }
  .settings{
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
    max-width: 100%;
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
