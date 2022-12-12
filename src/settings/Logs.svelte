<script>
  import Spinner from '../popup/Spinner.svelte'
  import LogRecord from './LogRecord.svelte'
  import { logsStore } from '../lib/logs_store.js'
  import { getSettingStore } from '../lib/settings_store.js'

  const logsMaxRecords = getSettingStore('settings:logsMaxRecords')

  $: displayedRecords = $logsStore != null ? $logsStore.slice(0, $logsMaxRecords) : null
</script>

{#if displayedRecords}
  <ul>
    {#each displayedRecords as record (record.bookmarkId + record.timestamp)}
      <LogRecord {record} />
    {:else}
      <li>empty</li>
    {/each}
  </ul>
{:else}
  <Spinner />
{/if}

<style>
  ul{
    background-color: var(--grey-eee);
  }
</style>
