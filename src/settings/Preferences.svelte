<script>
  import { i18n } from '../lib/i18n.js'
  import { repeatsOptions } from '../lib/repeats.js'
  document.title = `Time Capsule - ${i18n('Preferences')}`
  import { getSettingStore } from '../lib/settings_store.js'

  const allowDuplicatedTabs = getSettingStore('settings:allowDuplicatedTabs', false)
  const defaultRepeats = getSettingStore('settings:defaultRepeats', '∞')
</script>

<div class="preferences">
  <label>
    <input type="checkbox" bind:checked={$allowDuplicatedTabs}>
    Open a capsule even if its URL is already opened in a tab
  </label>

  <label>
    <p>Default number of times a capsule should be re-opened before being automatically deleted</p>
    <select bind:value={$defaultRepeats}>
      {#each repeatsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
  </label>
</div>

<style>
  .preferences{
    padding: 1em;
  }
  label{
    display: block;
    margin-bottom: 1em;
  }
  label p{
    display: block;
    margin-bottom: 0.5em;
  }
</style>
