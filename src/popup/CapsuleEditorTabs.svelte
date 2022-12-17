<script>
  import { i18n } from '../lib/i18n.js'
  import { getSettingStore } from '../lib/settings_store.js'
  const selectedTab = getSettingStore('popup:selectedTab')
</script>

<div class="tabs">
  <button
    on:click={() => $selectedTab = 'periodical'}
    title="[{i18n('Hotkey')}: p]"
    class:active={$selectedTab === 'periodical'}
  >
    {i18n('periodical')}
  </button>

  <button
    on:click={() => $selectedTab = 'one-time'}
    title="[{i18n('Hotkey')}: o]"
    class:active={$selectedTab === 'one-time'}
  >
    {i18n('one_time')}
  </button>

  <button
    on:click={() => $selectedTab = 'advanced'}
    title="[{i18n('Hotkey')}: d]"
    class:active={$selectedTab === 'advanced'}
  >
    {i18n('advanced')}
  </button>
</div>

<style>
  .tabs{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    padding: 1em 1em;
    margin-top: 1.5rem;
  }
  .tabs button{
    flex: 1 0 0;
    padding: 0.5em;
    text-align: center;
    border: 1px solid var(--grey-ddd);
  }
  .tabs button:first-child{
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  .tabs button:last-child{
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
  .tabs button:hover, .tabs button.active{
    background-color: var(--grey-ddd);
  }
  .tabs button.active{
    cursor: default;
  }
</style>
