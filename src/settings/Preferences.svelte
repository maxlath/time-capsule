<script>
  import { i18n } from '../lib/i18n.js'
  import { repeatsOptions } from '../lib/repeats.js'
  import { getSettingStore, restoreDefaultSettings } from '../lib/settings_store.js'
  import { range } from '../lib/utils.js'

  const maxCapsules = getSettingStore('settings:maxCapsules')
  const allowDuplicatedTabs = getSettingStore('settings:allowDuplicatedTabs')
  const defaultRepeats = getSettingStore('settings:defaultRepeats')
  const logsMaxRecords = getSettingStore('settings:logsMaxRecords')
  const openAsActiveTab = getSettingStore('settings:openAsActiveTab')
  const keepExpiredCapsulesAsNormalBookmarks = getSettingStore('settings:keepExpiredCapsulesAsNormalBookmarks')

  const maxCapsulesOptions = range(0, 10).concat([ 15, 20, 25, 30, 40, 50 ])
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
    <label for="maxCapsules">{i18n('maximum_number_of_capsules_that_can_be_opened_at_once')}</label>
    <p class="help">{i18n('above_this_threshold_only_one_tab_will_be_opened_with_a_list_of_all_the_capsules')}</p>
  </div>

  <div class="setting">
    <select id="repeats" bind:value={$defaultRepeats}>
      {#each repeatsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
    <label for="repeats">{i18n('default_number_of_repeats')}</label>
    <p class="help">{i18n('times_a_periodical_capsule_should_be_re_opened_before_being_automatically_archived_or_deleted')}</p>
  </div>

  <label class="setting">
    <input type="checkbox" bind:checked={$allowDuplicatedTabs}>
    {i18n('open_a_capsule_even_if_its_url_is_already_opened_in_a_tab')}
  </label>

  <label class="setting">
    <input type="checkbox" bind:checked={$openAsActiveTab}>
    {i18n('open_as_active_tab')}
  </label>

  <label class="setting">
    <input type="checkbox" bind:checked={$keepExpiredCapsulesAsNormalBookmarks}>
    {i18n('keep_expired_capsules_as_archived_bookmarks_instead_of_deleting_them')}
  </label>

  <hr>

  <h2>{i18n('Logs')}</h2>

  <div class="setting">
    <select id="maxCapsules" bind:value={$logsMaxRecords}>
      {#each logsMaxRecordsOptions as numOption}
        <option value={numOption}>{numOption}</option>
      {/each}
    </select>
    <label for="logsMaxRecords">{i18n('maximum_number_of_entries_to_keep_in_the_logs')}</label>
  </div>

  <hr>

  <button
    on:click={restoreDefaultSettings}
  >
    {i18n('restore_default_settings')}
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
