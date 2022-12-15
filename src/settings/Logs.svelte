<script>
  import Spinner from '../popup/Spinner.svelte'
  import LogRecord from './LogRecord.svelte'
  import { logsStore } from '../lib/logs_store.js'
  import { getSettingStore } from '../lib/settings_store.js'
  import { clearLogs } from '../lib/logs.js'

  const logsMaxRecords = getSettingStore('settings:logsMaxRecords')

  $: displayedRecords = $logsStore != null ? $logsStore.slice(0, $logsMaxRecords) : null
</script>

{#if displayedRecords}
  <ul>
    {#each displayedRecords as record (record.bookmarkId + record.timestamp)}
      <LogRecord {record} />
    {/each}
  </ul>
{:else}
  <Spinner />
{/if}

<div class="controls">
  {#if displayedRecords}
    {displayedRecords.length} log entries
  {/if}
  <button
    on:click={clearLogs}
  >
    Clear logs
  </button>
</div>

<style>
  ul{
    background-color: var(--grey-eee);
    flex: 1 0 0;
    overflow-y: auto;
  }
  .controls{
    margin-left: auto;
  }
  button{
    margin: 1em;
    padding: 0.5em 1em;
    border-radius: 3px;
    background-color: var(--grey-ddd);
  }
</style>
