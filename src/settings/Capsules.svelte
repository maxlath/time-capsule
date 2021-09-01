<script>
  import { getBookmarks } from '../lib/bookmarks'
  import { sortFunctions } from '../lib/sort_capsules'
  import Spinner from '../popup/Spinner.svelte'
  import CapsuleRow from './CapsuleRow.svelte'
  import { i18n } from '../lib/i18n'

  let bookmarks, sortedBookmark, bookmarksPage
  let sortField = 'nextVisit'
  let reverseSort = false

  const waitForBookmarks = getBookmarks()
    .then(b => bookmarks = b)

  $: {
    if (bookmarks) {
      sortedBookmark = bookmarks.sort(sortFunctions[sortField])
    }
  }

  $: {
    if (bookmarks) {
      bookmarksPage = reverseSort ? sortedBookmark.slice(0).reverse() : sortedBookmark
    }
  }

  const columns = [
    { label: 'Title', field: 'title' },
    { label: 'Frequency', field: 'frequency' },
    { label: 'Next Visit', field: 'nextVisit' },
    { label: 'Added', field: 'dateAdded' },
    { label: 'Actions' },
  ]

  function resort (e) {
    if (e.target.name === sortField) {
      reverseSort = !reverseSort
    } else {
      sortField = e.target.name
      reverseSort = false
    }
  }

</script>

{#await waitForBookmarks}
  <Spinner />
{:then}
  <table>
    <thead>
      <tr>
        {#each columns as column}
          <th>
            <button
              name={column.field}
              class:active={sortField === column.field}
              class:reversed={sortField === column.field && reverseSort}
              disabled={column.field == null}
              on:click={resort}
            >{i18n(column.label)}</button>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each bookmarksPage as bookmark (bookmark.id)}
        <CapsuleRow {bookmark} />
      {/each}
    </tbody>
  </table>
{/await}

<style>
  table{
    border-collapse: collapse;
    width: 100%;
  }
  th{
    font-weight: normal;
    padding: 0;
  }
  th{
    text-align: left;
  }
  th button{
    padding: 0.5em 1.5em 0.5em 0.5em;
    width: 100%;
    font-size: 1rem;
    position: relative;
    background-color: #eee;
    transition: background-color 0.3s ease;
  }
  button:disabled{
    color: inherit;
  }
  th button.active, th button:not(:disabled):hover{
    background-color: #ddd;
  }
  th button.active:after{
    content: '▲';
    color: #777;
    position: absolute;
    top: 10%;
    right: 0.5em;
  }
  th button.reversed:after{
    top: auto;
    transform: rotate(180deg);
    bottom: 10%;
  }
  tr:nth-child(even) {
    background: #eee;
  }
</style>
