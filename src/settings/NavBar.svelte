<nav>
  <div class="header">
    <img class="logo" src="/icons/time-capsule-32.png" alt="logo" />
    <h2>Time Capsule</h2>
  </div>
  <div class="start"><slot name="start" /></div>
  <div class="end"><slot name="end" /></div>
</nav>

<style>
  nav{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: var(--body-bg-color);
    z-index: 1;
  }
  .header{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5em 1em;
  }
  h2{
    font-size: 1.2rem;
    margin: 0.5em;
  }
  .end{
    margin-inline-start: auto;
    margin-inline-end: 1em;
  }
  /*Small screens*/
  @media screen and (max-width: 600px) {
    nav{
      flex-direction: column;
    }
  }
  /*Large screens*/
  @media screen and (min-width: 600px) {
    nav{
      position: sticky;
      top: 0;
    }
  }
</style>
