<script>
  import { getBookmarksByIds } from '../lib/bookmarks.js'
  import { getLogRecords } from '../lib/logs.js'
  import { keyBy, uniq } from '../lib/utils.js'
  import Flash from '../popup/Flash.svelte'
  import Spinner from '../popup/Spinner.svelte'
  import LogRecord from './LogRecord.svelte'

  let logRecords, flash

  const waitForLogRecords = getLogRecords()
    .then(res => {
      logRecords = res
      return addBookmarksData(logRecords)
    })
    .catch(err => flash = err)

  async function addBookmarksData (logRecords) {
    let bookmarksIds = logRecords.map(({ bookmarkId }) => bookmarkId)
    bookmarksIds = uniq(bookmarksIds)
    const bookmarks = await getBookmarksByIds(bookmarksIds)
    const bookmarksByIds = keyBy(bookmarks, 'id')
    for (const record of logRecords) {
      record.bookmark = bookmarksByIds[record.bookmarkId]
    }
  }
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
