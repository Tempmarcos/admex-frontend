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
  <Sidebar />
  <main class="main-content">
    {@render children()}
  </main>
</div>

<style>
  .app {
    display: flex;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .main-content {
    flex: 1;
    /* padding: 2rem; */
    margin-left: 0;
    transition: margin-left 0.3s ease;
    overflow-x: auto;
  }

  /* No desktop, ajustar margem para o sidebar */
  @media (min-width: 768px) {
    .main-content {
      margin-left: 280px; /* largura do sidebar */
    }
  }

  /* No mobile, o conteúdo ocupa toda a largura */
  @media (max-width: 767px) {
    .main-content {
      margin-left: 0;
      padding: 1rem;
    }
  }
</style>
