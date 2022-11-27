<script>
  export let state = null

  $: {
    if (state instanceof Error) {
      console.error(state)
    }
  }
</script>

{#if state}
  <div
    class="flash"
    class:error={state instanceof Error}
  >
    {state.message}
  </div>
{/if}

<style>
  .flash{
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    padding: 0.5em;
    margin: 0.3em 0;
    padding-left: 0.5em;
    color: #222;
    border-radius: 3px;
  }
  .error{
    background-color: var(--danger-color);
  }
</style>
