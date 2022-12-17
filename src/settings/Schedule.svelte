<script>
  import { getSettingStore } from '../lib/settings_store.js'
  import BlockedTimesPicker from './BlockedTimesPicker.svelte'
  const enableBlockedWeekTimes = getSettingStore('settings:enableBlockedWeekTimes')
</script>

<div class="schedule">
  <label class="setting">
    <input type="checkbox" bind:checked={$enableBlockedWeekTimes}>
    Prevent Time Capsule from opening during certain times of the week
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
