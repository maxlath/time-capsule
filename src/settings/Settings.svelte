<script>
  import { i18n } from '../lib/i18n'
  import Parameters from './Parameters.svelte'
  import Capsules from './Capsules.svelte'

  const tabs = [
    { key: 'capsules', label: i18n('Capsules') },
    { key: 'parameters', label: i18n('Parameters') },
  ]

  let currentTab = tabs[0]

  function onKeydown (e) {
    const { key, shiftKey } = e
    if (key === 'Tab') {
      const currentTabIndex = tabs.indexOf(currentTab)
      const incrementor = shiftKey ? -1 : 1
      let nextTabIndex = (currentTabIndex + incrementor) % tabs.length
      if (nextTabIndex === -1) nextTabIndex = tabs.length - 1
      if (tabs[nextTabIndex]) currentTab = tabs[nextTabIndex]
      e.stopPropagation()
      e.preventDefault()
    }
  }
</script>

<svelte:window on:keydown={onKeydown}/>

<nav>
  <img id="logo" src="/icons/time-capsule-32.png" alt="logo" />
  {#each tabs as tab}
    <button on:click={() => currentTab = tab} class:active={currentTab === tab}>{tab.label}</button>
  {/each}
</nav>

<div id="panel">
  {#if currentTab.key === 'parameters'}<Parameters />
  {:else if currentTab.key === 'capsules'}<Capsules />
  {/if}
</div>

<style>
  :global(body){
    margin: 0;
    font-family: sans-serif;
  }
  :global(button){
    cursor: pointer;
    border: 0;
    background-color: white;
  }
  nav{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    box-shadow: 0px 0px 0px 1px #20123a0a,
                0px 1px 2px 0px #2200330a,
                0px 2px 1px -1px #0730721f,
                0px 1px 6px 0px #0e0d1a1f;
  }
  #logo{
    margin: 0.8em 1em;
  }
  button{
    padding: 0.5rem;
    padding: 1rem;
    align-self: stretch;
    font-size: 1rem;
    border-bottom: 3px solid transparent;
    transition: all 0.25s ease;
  }
  .active, button:hover{
    border-bottom: 3px solid #592acb;
    color: #592acb;
  }
</style>
