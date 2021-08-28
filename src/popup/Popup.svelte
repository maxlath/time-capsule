<script>
  import OptionsSelector from './OptionsSelector.svelte'
  import Spinner from './Spinner.svelte'
  import { setFrequency } from '../lib/actions'
  import { getUrl, getCurrentUrlBookmarkData } from '../lib/tabs'
  import { i18n } from '../lib/i18n'

  let selectedFrequency, nextVisit, waitingForBookmarkData, currentUrl

  getUrl().then(url => currentUrl = url)

  waitingForBookmarkData = getCurrentUrlBookmarkData()
    .then(bookmarkData => {
      if (bookmarkData) {
        nextVisit = new Date(bookmarkData.nextVisit).toLocaleString()
        selectedFrequency = bookmarkData.frequency
      }
    })

  $: selectedFrequency && setFrequency(selectedFrequency)

  // Filter-out URLs such as 'about:*' and 'file:*'
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=1352835
  $: isTimeCapsulableUrl = currentUrl && currentUrl.startsWith('http')

</script>

{#if nextVisit}
  <div id="nextVisit">
    <h2>{i18n('next_visit')}</h2>
    <p>{nextVisit}</p>
  </div>
{/if}

{#if isTimeCapsulableUrl}
  {#await waitingForBookmarkData}
    <Spinner />
  {:then}
    <OptionsSelector bind:selectedFrequency />
  {/await}
{:else}
  <p class="invalid">{i18n('url_cant_be_time_capsuled')}</p>
{/if}

<style>
  :global(p), :global(ul), :global(ul li){
    margin: 0;
    padding: 0;
  }

  :global(ul), :global(ul li){
    list-style-type: none;
  }

  :global(html){
    font-family: sans-serif;
    background-color: #f0f0f0;
    margin: 0;
  }

  :global(body){
    background-color: #f0f0f0;
    color: #222;
    margin: 0 auto;
    padding: 2px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    min-width: 19em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  :global(main){
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
  }

  :global(:root){
    --glow: rgba(158, 202, 237, 0.7);
    --light-blue: #0099d4;
    --darker-light-blue: #0077b4;
    --success-color: #22ee22;
  }

  h2{
    text-align: center;
    font-size: 1rem;
    margin-bottom: 0;
  }

  #nextVisit p{
    text-align: center;
  }

  .invalid{
    padding: 1em;
    font-style: italic;
    color: #666;
  }
</style>
