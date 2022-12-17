<script>
  import { removeOrArchiveBookmark, updateCapsuleData } from '../lib/bookmarks.js'
  import { i18n } from '../lib/i18n.js'

  export let bookmark, possibleUpdate, activeTab

  async function update ({ url, title }) {
    await updateCapsuleData({
      bookmarkData: bookmark,
      newUrl: url,
      newTitle: title,
    })
    await browser.runtime.sendMessage(null, {
      event: 'popup-updated-capsule',
      tabId: activeTab.id,
    })
    window.close()
  }

  async function deleteBookmark () {
    try {
      await removeOrArchiveBookmark(bookmark)
      await browser.runtime.sendMessage(null, {
        event: 'popup-deleted-capsule',
        tabId: activeTab.id,
      })
      window.close()
    } catch (err) {
      console.error(err)
    }
  }
</script>

<div class="possibly-obsolete-capsule-editor">
  <p>{i18n('this_tab_was_opened_because_of_a_capsule_set_on_the_following_url')}</p>
  <pre>{bookmark.url}</pre>
  <p>{i18n('but_then_the_tab_url_changed_to')}</p>
  <pre>{possibleUpdate.url}</pre>

  <div class="buttons">
    <button
      class="update"
      on:click={() => update(possibleUpdate)}
    >
      {i18n('update_capsule_url_to_possible_update_url', possibleUpdate.url)}
    </button>

    {#if activeTab.url !== possibleUpdate.url}
      <button
        class="update"
        on:click={() => update(activeTab)}
      >
        {i18n('update_capsule_url_to_possible_update_url', activeTab.url)}
      </button>
    {/if}

    <button
      class="delete"
      on:click={deleteBookmark}
    >
      {i18n('delete_capsule')}
    </button>
  </div>
</div>

<style>
  .possibly-obsolete-capsule-editor{
    margin-top: 1em;
    padding: 1em;
    max-width: 40em;
    overflow: hidden;
  }
  .buttons{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  button{
    text-overflow: ellipsis;
    display: block;
    padding: 0.5em;
    margin: 0.5em;
    border-radius: 3px;
  }
  .update{
    background-color: var(--light-blue);
  }
  .delete{
    background-color: var(--danger-color);
  }
</style>
