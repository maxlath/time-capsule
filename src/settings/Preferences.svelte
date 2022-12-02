<script>
  import { i18n } from '../lib/i18n.js'
  document.title = `Time Capsule - ${i18n('Preferences')}`
  import { getSettingStore } from '../lib/settings_store.js'

  const allowDuplicatedTabs = getSettingStore('settings:allowDuplicatedTabs', false)
</script>

<div class="preferences">
  <label>
    <input type="checkbox" bind:checked={$allowDuplicatedTabs}>
    Open a Capsule even if its URL is already opened in a tab
  </label>
</div>

<style>
  .preferences{
    padding: 1em;
  }
</style>
