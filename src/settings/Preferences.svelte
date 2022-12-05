<script>
  import { repeatsOptions } from '../lib/repeats.js'
  import { getSettingStore } from '../lib/settings_store.js'
  import { range } from '../lib/utils.js'

  const maxCapsules = getSettingStore('settings:maxCapsules')
  const allowDuplicatedTabs = getSettingStore('settings:allowDuplicatedTabs')
  const defaultRepeats = getSettingStore('settings:defaultRepeats')

  const maxCapsulesOptions = range(1, 10).concat([ 15, 20, 25, 30, 40, 50 ])
</script>

<div class="preferences">
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
    <p class="help">Times a capsule should be re-opened before being automatically deleted</p>
  </div>

  <label class="setting">
    <input type="checkbox" bind:checked={$allowDuplicatedTabs}>
    Open a capsule even if its URL is already opened in a tab
  </label>
</div>

<style>
  .preferences{
    padding: 1em;
  }
  .setting{
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
</style>
