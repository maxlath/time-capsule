<script>
  import { recover, removeById } from '../lib/bookmarks'
  import { epochToSimpleTime } from '../lib/times'
  import { i18n } from '../lib/i18n'
  import { createEventDispatcher } from 'svelte'

  export let bookmark

  const dispatch = createEventDispatcher()

  function edit () {
    dispatch('edit', bookmark)
  }

  async function deleteBookmark () {
    bookmark.deleted = true
    try {
      await removeById(bookmark.id)
    } catch (err) {
      console.error(err)
      bookmark.deleted = false
    }
  }

  async function undeleteBookmark () {
    bookmark.deleted = false
    try {
      const newBookmark = await recover(bookmark)
      Object.assign(bookmark, newBookmark)
    } catch (err) {
      console.error(err)
      bookmark.deleted = true
    }
  }
</script>

<tr class:deleted={bookmark.deleted}>
  <td class="title"><a href={bookmark.url} title={bookmark.url}>{bookmark.cleanedTitle}</a></td>
  <td class="frequency" title={bookmark.frequencyLabel}>{bookmark.frequency}</td>
  <td class="nextVisit">{new Date(bookmark.nextVisit).toLocaleString()}</td>
  <td class="dateAdded">{new Date(bookmark.dateAdded).toLocaleString()}</td>
  <td>
    {#if bookmark.deleted}
      <button class="undelete" on:click={undeleteBookmark}>{i18n('Undo')}</button>
    {:else}
      <button class="edit" on:click={edit}>{i18n('Edit')}</button>
      <button class="delete" on:click={deleteBookmark}>{i18n('Delete')}</button>
    {/if}
  </td>
</tr>

<style>
  td{
    font-weight: normal;
    padding: 0.2em;
  }
  .title{
    text-align: left;
  }
  .frequency{
    text-align: right;
  }
  .nextVisit, .dateAdded{
    padding: 0 0.5em;
  }
  button{
    background-color: transparent;
    font-size: 1rem;
    text-decoration: underline;
    color: #222;
  }
  button:hover{
    color: #444;
  }
  tr{
    border-bottom: 1px solid #ccc;
  }
  tr.deleted{
    opacity: 0.8;
    background-color: #eee;
  }
  td{
    padding: 0.5em;
  }
</style>