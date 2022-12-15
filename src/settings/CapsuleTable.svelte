<script>
  import { getBookmarks } from '../lib/bookmarks.js'
  import { sortFunctions } from '../lib/sort_capsules.js'
  import Spinner from '../popup/Spinner.svelte'
  import CapsuleRow from './CapsuleRow.svelte'
  import { i18n } from '../lib/i18n.js'
  import { columns, filterByText } from './capsule_table_helpers.js'
  import Flash from '../popup/Flash.svelte'

  export let bookmarksPromise, editedBookmark

  let bookmarks, filteredBookmarks, sortedBookmark, bookmarksPage, flash
  let textFilter = ''
  let sortField = 'nextVisit'
  let reverseSort = false

  bookmarksPromise = bookmarksPromise || getBookmarks()

  bookmarksPromise
  .then(b => bookmarks = b)
  .catch(err => flash = err)

  function resort (e) {
    if (e.target.name === sortField) {
      reverseSort = !reverseSort
    } else {
      sortField = e.target.name
      reverseSort = false
    }
  }

  $: {
    if (bookmarks) {
      if (textFilter.trim().length > 0) {
        filteredBookmarks = bookmarks.filter(filterByText(textFilter))
      } else {
        filteredBookmarks = bookmarks
      }
      sortedBookmark = filteredBookmarks.sort(sortFunctions[sortField])
      bookmarksPage = reverseSort ? sortedBookmark.slice(0).reverse() : sortedBookmark
    }
  }
</script>

<Flash state={flash} />

{#await bookmarksPromise}
  <Spinner />
{:then}
  <div class="controls">
    <label>
      {i18n('Filter')}
      <input type="search" bind:value={textFilter}>
    </label>

    {#if bookmarks && bookmarksPage}
      <span class="count">
        {bookmarksPage.length}/{bookmarks.length}
      </span>
    {/if}
  </div>
  <table>
    <thead>
      <tr>
        {#each columns as column}
          <th>
            {#if column.field}
              <button
                name={column.field}
                class:active={sortField === column.field}
                class:reversed={sortField === column.field && reverseSort}
                disabled={column.field == null}
                on:click={resort}
              >
                {i18n(column.label)}
              </button>
            {:else}
              <span>{i18n(column.label)}</span>
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if bookmarksPage}
        {#each bookmarksPage as bookmark (bookmark.id)}
          <CapsuleRow {bookmark} on:edit={() => editedBookmark = bookmark} />
        {/each}
      {/if}
    </tbody>
  </table>
{/await}

<style>
  .controls{
    display: flex;
    flex-direction: row;
    padding: 0.5em;
    background-color: var(--grey-eee);
  }
  .controls label, th, th button{
    font-weight: bold;
    color: var(--grey-444);
  }
  .controls input{
    padding: 0.3em;
    border-radius: 3px;
    box-shadow: none;
  }
  .count{
    align-self: center;
    margin-inline-start: 1em;
    color: var(--grey-444);
    margin-inline-start: auto;
  }
  table{
    border-collapse: collapse;
    width: 100%;
    border-top: 1px solid var(--grey-ccc);
  }
  th{
    font-weight: normal;
    padding: 0;
  }
  th:not(:last-child){
    border-right: 1px solid var(--grey-ccc);
  }
  th button, th span{
    text-align: center;
    display: block;
    padding: 0.5em 1.5em 0.5em 0.5em;
    font-size: 1rem;
    position: relative;
    background-color: var(--grey-eee);
  }
  th button{
    width: 100%;
    transition: background-color 0.3s ease;
  }
  button:disabled{
    color: inherit;
  }
  th button.active, th button:not(:disabled):hover{
    background-color: var(--grey-ddd);
  }
  th button.active:after{
    content: '▲';
    color: var(--grey-777);
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
    background: var(--grey-eee);
  }
</style>
