<script>
  import { recover, removeOrArchiveBookmark } from '../lib/bookmarks.js'
  import { i18n } from '../lib/i18n.js'
  import { createEventDispatcher } from 'svelte'

  export let bookmark

  const dispatch = createEventDispatcher()

  function edit () {
    dispatch('edit', bookmark)
  }

  async function deleteBookmark () {
    bookmark.deleted = true
    try {
      await removeOrArchiveBookmark(bookmark)
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

  let repeat
  $: {
    if (bookmark.repeat) repeat = bookmark.repeat
    else if (bookmark.nextVisit) repeat = '∞'
    else repeat = null
  }
</script>

<tr class:deleted={bookmark.deleted} class:last-repeat={repeat == null}>
  <td class="title">
    <a href={bookmark.url} title={bookmark.cleanedTitle}>
      {bookmark.cleanedTitle || bookmark.title || bookmark.url}
    </a>
    <span class="hostname">{new URL(bookmark.url).hostname}</span>
  </td>
  <td class="frequency" title={bookmark.frequencyLabel}>{bookmark.frequency || ''}</td>
  <td class="repeat">{repeat != null ? repeat : ''}</td>
  <td class="next-visit">{bookmark.nextVisit ? new Date(bookmark.nextVisit).toLocaleString() : i18n('None')}</td>
  <td class="actions">
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
    text-align: right;
  }
  .title{
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    max-width: 45em;
  }
  .title a{
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hostname{
    margin-left: 0.5em;
    color: var(--grey-444);
    font-size: 0.8rem;
  }
  .next-visit{
    padding: 0 0.5em;
  }
  button{
    background-color: transparent;
    font-size: 1rem;
    text-decoration: underline;
    color: var(--grey-222);
  }
  button:hover{
    color: var(--grey-444);
  }
  tr{
    border-bottom: 1px solid var(--grey-ccc);
  }
  tr.deleted{
    opacity: 0.8;
    background-color: var(--grey-eee);
  }
  tr.last-repeat{
    background-color: var(--danger-color);
  }
  tr.last-repeat .next-visit{
    text-align: start;
  }
  td{
    padding: 0.5em;
  }
</style>
