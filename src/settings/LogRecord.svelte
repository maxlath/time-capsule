<script context="module">
  import { i18n } from '../lib/i18n.js'

  const eventLabels = {
    'opened-bookmark': i18n('Opened')
  }
</script>

<script>
  export let record
  const { event, bookmark, timestamp } = record
</script>

<li>
  <span
    class="event"
    class:opened={event === 'opened-bookmark'}
  >{eventLabels[event]}</span>
  <span class="bookmark-url">
    <a href={bookmark.url}>{bookmark.cleanedTitle}</a>
  </span>
  <span class="timestamp">{new Date(timestamp).toLocaleString()}</span>
</li>

<style>
  li{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 1em;
    padding: 0.5em;
    border-bottom: 1px solid var(--grey-ccc);
  }
  li span{
    margin: 0 0.5em;
  }
  .event{
    padding: 0.2em 0.5em;
    border-radius: 3px;
  }
  .opened{
    background-color: var(--success-color);
  }
  .bookmark-url{
    min-width: min(90vw, 15em);
  }
  .timestamp{
    margin-inline-start: auto;
    flex: 0 0 auto;
  }
</style>
