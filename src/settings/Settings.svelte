<script>
  import { i18n } from '../lib/i18n'
  import Parameters from './Parameters.svelte'
  import Incoming from './Incoming.svelte'
  import LatestCreated from './LatestCreated.svelte'

  let currentTab = 'parameters'
</script>

<nav>
  <img id="logo" src="/icons/time-capsule-32.png" alt="logo" />
  <button on:click={e => currentTab = 'parameters'} class:active={currentTab === 'parameters'}>{i18n('Parameters')}</button>
  <button on:click={e => currentTab = 'incoming'} class:active={currentTab === 'incoming'}>{i18n('Incoming')}</button>
  <button on:click={e => currentTab = 'latest'} class:active={currentTab === 'latest'}>{i18n('Latest created')}</button>
</nav>

<div id="panel">
  {#if currentTab === 'parameters'}<Parameters />
  {:else if currentTab === 'incoming'}<Incoming />
  {:else if currentTab === 'latest'}<LatestCreated />
  {/if}
</div>

<style>
  :global(body){
    margin: 0;
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
    cursor: pointer;
    border: 0;
    background-color: white;
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
  #panel{
    padding: 1em;
  }
</style>
