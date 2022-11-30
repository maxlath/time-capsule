<script>
  import { getBookmarks } from '../lib/bookmarks'
  import { sortFunctions } from '../lib/sort_capsules'
  import Spinner from '../popup/Spinner.svelte'
  import CapsuleRow from './CapsuleRow.svelte'
  import CapsuleEditor from '../popup/CapsuleEditor.svelte'
  import { i18n } from '../lib/i18n'
  import { onChange } from '../lib/svelte'

  let bookmarks, sortedBookmark, bookmarksPage
  let sortField = 'nextVisit'
  let reverseSort = false
  let editedBookmark

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
    { label: 'Next_Visit', field: 'nextVisit' },
    { label: 'Date_Created', field: 'dateAdded' },
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

  function updateBookmark () {
    bookmarks = bookmarks
  }

  $: onChange(editedBookmark, updateBookmark)
</script>

{#if editedBookmark}
  {#if editedBookmark.cleanedTitle}
    <div class="edited-bookmark-info">
      <a href={editedBookmark.url} title={editedBookmark.url}>{editedBookmark.cleanedTitle}</a>
    </div>
  {/if}
  <div class="editor-wrapper">
    <div class="editor">
      <pre>{JSON.stringify({
        editedBookmark: editedBookmark ? editedBookmark.frequency : null,
      }, null, 2)} (Capsules.svelte:64)</pre>
      <CapsuleEditor
        bind:bookmark={editedBookmark}
        url={editedBookmark.url}
        context="settings"
        on:done={() => editedBookmark = null}
      />
    </div>
  </div>
{:else}
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
          <CapsuleRow {bookmark} on:edit={() => editedBookmark = bookmark} />
        {/each}
      </tbody>
    </table>
  {/await}
{/if}

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
  .editor-wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #eee;
  }
  .editor{
    max-width: 30em;
    background-color: white;
    margin: 1em 1em 5em 1em;
    border-radius: 3px;
    padding: 1em;
    position: relative;
  }
  .edited-bookmark-info{
    background-color: #eee;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .edited-bookmark-info a{
    background-color: white;
    margin: auto;
    max-width: 30em;
    margin: 1em 1em 0 1em;
    padding: 1em;
    border-radius: 3px;
  }
</style>
