<script>
  export let celebratedNewFrequency, celebratedAction
</script>

<div class="celebration-wrapper">
  {#if celebratedAction === 'removed'}
    <p class="action removed">
      <img src="/icons/red-trash-bin.svg" alt="delete icon" />
    </p>
  {:else if celebratedAction === 'archived'}
    <p class="action archived">
      <img src="/icons/orange-archive.svg" alt="archive icon" />
    </p>
  {:else if celebratedNewFrequency}
    <p>{celebratedNewFrequency}</p>
  {/if}
</div>

<style>
  .celebration-wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 15em;
  }
  .celebration-wrapper p{
    font-size: 3em;
    font-weight: bold;
    color: var(--success-color);
    animation-name: grow-out-text;
    animation-duration: 0.5s;
  }
  .action{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 2em;
    width: 2em;
    animation-name: grow-out-svg;
    animation-duration: 0.5s;
  }

  @keyframes grow-out-text{
    to {
      font-size: 6em;
      opacity: 0;
    }
  }
  @keyframes grow-out-svg{
    to {
      height: 4em;
      width: 4em;
      opacity: 0;
    }
  }
</style>