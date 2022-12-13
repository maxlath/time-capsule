<script>
  import { removeOrArchiveBookmark, updateCapsuleData } from '../lib/bookmarks.js'

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
  <p>This tab was opened because of a Capsule set on the following URL:</p>
  <pre>{bookmark.url}</pre>
  <p>But then the tab URL changed to:</p>
  <pre>{possibleUpdate.url}</pre>

  <div class="buttons">
    <button
      class="update"
      title={`Update Capsule URL to ${possibleUpdate.url}`}
      on:click={() => update(possibleUpdate)}
    >
      Update Capsule URL to {possibleUpdate.url}
    </button>

    {#if activeTab.url !== possibleUpdate.url}
      <button
        class="update"
        title={`Update Capsule URL to ${activeTab.url}`}
        on:click={() => update(activeTab)}
      >
        Update Capsule URL to {activeTab.url}
      </button>
    {/if}

    <button
      class="delete"
      on:click={deleteBookmark}
    >
      Delete Capsule
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
