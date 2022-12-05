<script>
  import CapsuleEditor from '../popup/CapsuleEditor.svelte'
  import CapsuleTable from './CapsuleTable.svelte'

  export let bookmarksPromise = null

  let editedBookmark
</script>

{#if editedBookmark}
  {#if editedBookmark.cleanedTitle}
    <div class="edited-bookmark-info">
      <a href={editedBookmark.url} title={editedBookmark.url}>{editedBookmark.cleanedTitle}</a>
    </div>
  {/if}
  <div class="editor-wrapper">
    <div class="editor">
      <CapsuleEditor
        bind:bookmark={editedBookmark}
        url={editedBookmark.url}
        context="settings"
        on:done={() => editedBookmark = null}
      />
    </div>
  </div>
{:else}
  <CapsuleTable {bookmarksPromise} bind:editedBookmark />
{/if}

<style>
  .editor-wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--grey-eee);
  }
  .editor{
    max-width: 30em;
    background-color: var(--white);
    margin: 1em 1em 5em 1em;
    border-radius: 3px;
    padding: 1em;
    position: relative;
  }
  .edited-bookmark-info{
    background-color: var(--grey-eee);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .edited-bookmark-info a{
    background-color: var(--white);
    margin: auto;
    max-width: 30em;
    margin: 1em 1em 0 1em;
    padding: 1em;
    border-radius: 3px;
  }
</style>
