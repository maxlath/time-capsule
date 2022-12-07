<script>
  import { getLogRecords } from '../lib/logs.js'
  import Flash from '../popup/Flash.svelte'
  import Spinner from '../popup/Spinner.svelte'
  import LogRecord from './LogRecord.svelte'

  let logRecords, flash

  const waitForLogRecords = getLogRecords()
    .then(res => {
      logRecords = res
    })
    .catch(err => flash = err)
</script>

<Flash state={flash} />

{#await waitForLogRecords}
  <Spinner />
{:then}
  <ul>
    {#each logRecords as record}
      <LogRecord {record} />
    {:else}
      <li>empty</li>
    {/each}
  </ul>
{/await}

<style>
  ul{
    background-color: var(--grey-eee);
  }
</style>
