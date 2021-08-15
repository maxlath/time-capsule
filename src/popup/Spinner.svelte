<div>
  <span class="spinner"></span>
</div>

<style>
  div{
    min-width: 20em;
    margin: auto 1em;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .spinner:after{
    content: " ";
    display: inline-flex;
    width: 1em;
    height: 1em;
    margin: auto 1em;
    border-radius: 100%;
    animation: ring-loader 1.2s linear infinite;
    border: 20px solid;
    border-color: #333 #333 #118175 transparent;
  }

  @keyframes ring-loader{
    0%{
      transform: rotate(0deg);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>
