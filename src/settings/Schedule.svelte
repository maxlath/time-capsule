<script>
  import { i18n } from '../lib/i18n.js'
  import { getSettingStore } from '../lib/settings_store.js'
  import BlockedTimesPicker from './BlockedTimesPicker.svelte'
  const enableBlockedWeekTimes = getSettingStore('settings:enableBlockedWeekTimes')
</script>

<div class="schedule">
  <label class="setting">
    <input type="checkbox" bind:checked={$enableBlockedWeekTimes}>
    {i18n('prevent_time_capsule_from_opening_during_certain_times_of_the_week')}
  </label>

  {#if $enableBlockedWeekTimes}
    <div class="blocked-times-picker-wrapper">
      <BlockedTimesPicker />
    </div>
  {/if}
</div>

<style>
  .schedule{
    flex: 1;
    padding: 1em;
    overflow: auto;
  }
  label{
    margin: 1em;
  }
  .blocked-times-picker-wrapper{
    margin-top: 1em;
  }
</style>
