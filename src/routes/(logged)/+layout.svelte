<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../../app.css";

  /** @type {{children: import('svelte').Snippet}} */
  let { children } = $props();
</script>

<div class="app">
  <main>
    {@render children()}
  </main>
  <Sidebar />
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 64rem;
  }
</style>
