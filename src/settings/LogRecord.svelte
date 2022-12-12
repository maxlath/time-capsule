<script>
  import { events } from '../lib/logs.js'
  export let record

  const { event, url, title, timestamp, remainingRepeats, changes = {} } = record
  const eventLabel = events[event].label
</script>

<li>
  <span
    class="event"
    class:opened={event === 'opened-bookmark'}
    class:skipped={event === 'skipped-already-opened-bookmark'}
    class:created={event === 'created-bookmark'}
    class:updated={event === 'updated-bookmark'}
    class:removed={event === 'removed-bookmark'}
  >
    {eventLabel}
  </span>

  <div class="bookmark-url">
    <a href={url}>{title}</a>
    <span class="hostname">{new URL(url).hostname}</span>
  </div>

  {#each Object.entries(changes) as [ attribute, { old: oldValue, new: newValue } ] }
    <span
      class="change"
      title={`old ${attribute}: ${oldValue} | new ${attribute}: ${newValue}`}
    >
      {`new ${attribute}`}: {newValue}
    </span>
  {/each}

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
  .skipped{
    background-color: var(--grey-ddd);
  }
  .created{
    background-color: var(--light-blue);
  }
  .updated{
    background-color: var(--darker-light-blue);
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
