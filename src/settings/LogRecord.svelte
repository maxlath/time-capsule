<script>
  import { i18n } from '../lib/i18n.js'
  import { events } from '../lib/logs.js'
  export let record

  const { event, url, title, timestamp, remainingRepeats, changes = {} } = record
  const eventLabel = events[event].label
  const displayRepeats = !/^(removed|archived)/.test(event)
</script>

<li>
  <span
    class="event"
    class:opened={event === 'opened-bookmark'}
    class:overflow={event === 'opened-overflow-menu'}
    class:skipped={event === 'skipped-already-opened-bookmark'}
    class:created={event === 'created-bookmark'}
    class:updated={event === 'updated-bookmark'}
    class:archived={event === 'archived-bookmark'}
    class:removed={event === 'removed-bookmark'}
  >
    {eventLabel}
  </span>

  <div class="bookmark-url">
    <a href={url}>{title}</a>
    {#if url[0] !== '/'}
      <span class="hostname">{new URL(url).hostname}</span>
    {/if}
  </div>

  {#each Object.entries(changes) as [ attribute, { old: oldValue, new: newValue } ] }
    <span
      class="change"
      title="{i18n(`old_${attribute}`, oldValue)} | {i18n(`new_${attribute}`, newValue)}"
    >
      {i18n(`new_${attribute}`, newValue)}
    </span>
  {/each}

  <ul class="flags">
    {#if displayRepeats && Number.isInteger(remainingRepeats)}
      <li
        class="info"
        class:warning={remainingRepeats < 1}
      >{i18n('remaining_repeats', remainingRepeats)}</li>
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
  .event{
    width: 6em;
  }
  .event, .warning, .info{
    padding: 0.2em 0.5em;
    border-radius: 3px;
  }
  .opened{
    background-color: var(--success-color);
  }
  .overflow{
    background-color: var(--warning-color);
  }
  .skipped{
    background-color: var(--grey-ddd);
  }
  .created{
    background-color: var(--light-blue);
  }
  .updated{
    background-color: var(--darker-light-blue);
  }
  .archived{
    background-color: var(--warning-color);
  }
  .removed{
    background-color: var(--danger-color);
  }
  .bookmark-url{
    min-width: min(90vw, 15em);
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
  }
  .hostname{
    margin-left: 0.5em;
    color: var(--grey-444);
    font-size: 0.8rem;
  }
  .flags{
    margin-inline-start: auto;
  }
  .info{
    background-color: var(--darker-light-blue);
  }
  .warning{
    background-color: var(--warning-color);
  }
  .timestamp{
    flex: 0 0 auto;
  }
</style>
