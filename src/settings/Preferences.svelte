<script>
  import { i18n } from '../lib/i18n.js'
  import { repeatsOptions } from '../lib/repeats.js'
  import { getSettingStore, restoreDefaultSettings } from '../lib/settings_store.js'
  import { range } from '../lib/utils.js'

  const maxCapsules = getSettingStore('settings:maxCapsules')
  const allowDuplicatedTabs = getSettingStore('settings:allowDuplicatedTabs')
  const defaultRepeats = getSettingStore('settings:defaultRepeats')
  const logsMaxRecords = getSettingStore('settings:logsMaxRecords')
  const keepExpiredCapsulesAsNormalBookmarks = getSettingStore('settings:keepExpiredCapsulesAsNormalBookmarks')

  const maxCapsulesOptions = range(1, 10).concat([ 15, 20, 25, 30, 40, 50 ])
  const logsMaxRecordsOptions = [ 10, 100, 1000, 10000 ]
</script>

<div class="preferences">
  <h2>{i18n('Capsules')}</h2>

  <div class="setting">
    <select id="maxCapsules" bind:value={$maxCapsules}>
      {#each maxCapsulesOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
    <label for="maxCapsules">Maximum number of capsules that can be opened at once</label>
    <p class="help">Above this threshold, only one tab will be opened, with a list of all the capsules</p>
  </div>

  <div class="setting">
    <select id="repeats" bind:value={$defaultRepeats}>
      {#each repeatsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
    <label for="repeats">Default number of repeats</label>
    <p class="help">Times a periodical capsule should be re-opened before being automatically archived or deleted</p>
  </div>

  <label class="setting">
    <input type="checkbox" bind:checked={$keepExpiredCapsulesAsNormalBookmarks}>
    Keep expired capsules as archived bookmarks, instead of deleting them
  </label>

  <label class="setting">
    <input type="checkbox" bind:checked={$allowDuplicatedTabs}>
    Open a capsule even if its URL is already opened in a tab
  </label>

  <hr>

  <h2>{i18n('Logs')}</h2>

  <div class="setting">
    <select id="maxCapsules" bind:value={$logsMaxRecords}>
      {#each logsMaxRecordsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
    <label for="logsMaxRecords">Maximum number of entries to keep in the logs</label>
  </div>

  <hr>

  <button
    on:click={restoreDefaultSettings}
  >
    Restore default settings
  </button>
</div>

<style>
  .preferences{
    padding: 1em;
    overflow-y: auto;
  }
  .setting{
    display: block;
    margin: 2em 1em;
  }
  .help{
    margin-bottom: 0.5em;
    font-size: 0.9rem;
    margin-left: 4em;
    color: var(--grey-444);
  }
  select{
    padding: 0.3em 0.5em;
  }
  hr{
    margin: 2em 0;
    opacity: 0.5;
  }
  h2{
    font-size: 1.2rem;
  }
  button{
    margin: 1em;
    padding: 0.5em 1em;
    border-radius: 3px;
    background-color: var(--grey-ddd);
  }
</style>
