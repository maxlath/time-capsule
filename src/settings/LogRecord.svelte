<script context="module">
  import { i18n } from '../lib/i18n.js'

  const eventLabels = {
    'opened-bookmark': i18n('Opened'),
    'skipped-already-opened-bookmark': i18n('Skipped'),
  }
</script>
<script>
  export let record
  const { event, url, title, timestamp, remainingRepeats } = record
</script>

<li>
  <span
    class="event"
    class:opened={event === 'opened-bookmark'}
    class:skipped={event === 'skipped-already-opened-bookmark'}
  >
    {eventLabels[event]}
  </span>

  <span class="bookmark-url">
    <a href={url}>{title}</a>
  </span>

  <ul class="flags">
    {#if Number.isInteger(remainingRepeats)}
      {#if remainingRepeats === 0}
        <li class="warning">deleted</li>
      {:else}
        <li class="info">{remainingRepeats} remaining repeats</li>
      {/if}
    {/if}
  </ul>

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
  .event, .warning, .info{
    padding: 0.2em 0.5em;
    border-radius: 3px;
  }
  .opened{
    background-color: var(--success-color);
  }
  .bookmark-url{
    min-width: min(90vw, 15em);
  }
  .flags{
    margin-inline-start: auto;
  }
  .warning{
    background-color: var(--warning-color);
  }
  .info{
    background-color: var(--darker-light-blue);
  }
  .timestamp{
    flex: 0 0 auto;
  }
</style>
