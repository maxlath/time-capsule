<script>
  import { getSettingStore } from '../lib/settings_store.js'
  const selectedTab = getSettingStore('popup:selectedTab')
</script>

<div class="tabs">
  <button
    on:click={() => $selectedTab = 'one-time'}
    class:active={$selectedTab === 'one-time'}
  >
    One Time
  </button>

  <button
    on:click={() => $selectedTab = 'periodical'}
    class:active={$selectedTab === 'periodical'}
  >
    Periodical
  </button>

  <button
    on:click={() => $selectedTab = 'advanced'}
    class:active={$selectedTab === 'advanced'}
  >
    Advanced
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
