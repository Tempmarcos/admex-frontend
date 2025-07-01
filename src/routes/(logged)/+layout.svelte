<script>
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../../app.css";

  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { token, usuario } from "$lib/stores/auth";

  onMount(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("usuario");

    if (!storedToken || !storedUser) {
      // Redireciona para a tela de login
      alert("Token ausente. Retornando à tela de login");
      goto("/");
    } else {
      // Reconfigura os stores para garantir que o estado esteja correto
      token.set(storedToken);
      usuario.set(JSON.parse(storedUser));
    }
  });

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
  }
</style>
