<script lang="ts">
  import Sidebar from "$lib/components/Sidebar.svelte";
  import "../../app.css";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { tokenLogin, usuarioLogado } from "$lib/utils/login";
  import { get } from "svelte/store";
  import { jwtDecode } from "jwt-decode";

  onMount(() => {
    const storedUser = get(usuarioLogado);
    const storedToken = get(tokenLogin);

    if (!storedToken || !storedUser) {
      // alert("Token ausente. Retornando à tela de login");
      goto("/");
    } 
    try{
      const { exp } = jwtDecode<{ exp: number }>(storedToken);

      if (!exp || Date.now() >= exp * 1000) {
        // alert("Sessão expirada. Faça login novamente.");
        goto("/");
      }
    }catch(err){
      // alert("Token inválido ou corrompido")
      goto("/")
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
