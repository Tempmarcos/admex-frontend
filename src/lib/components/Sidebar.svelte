<script lang="ts">
  import { page } from "$app/state";
    import { loggout } from "$lib/utils/loggout";
  import { hasPermission } from "$lib/utils/user/hasPermission";
</script>

<div class="sidebar">
  <nav>
  <div class="logo"></div>
    <ul>
      <li aria-current={page.url.pathname === "/inicio" ? "page" : undefined}>
        <a href="/inicio">Início</a>
      </li>
      {#if hasPermission("verUsuarios")}
        <li
          aria-current={page.url.pathname === "/usuarios" ? "page" : undefined}
        >
          <a href="/usuarios">Usuários</a>
        </li>
      {/if}
      {#if hasPermission('verDados')}
        <li
          aria-current={page.url.pathname === "/empresa" ? "page" : undefined}
        >
          <a href="/empresa">Empresa</a>
        </li>
      {/if}
      {#if hasPermission("verItens")}
        <li
          aria-current={page.url.pathname.startsWith("/itens")
            ? "page"
            : undefined}
        >
          <a href="/itens">Itens</a>
        </li>
      {/if}
      {#if hasPermission("verEntidades")}
        <li
          aria-current={page.url.pathname.startsWith("/relacoes")
            ? "page"
            : undefined}
        >
          <a href="/relacoes">Relações</a>
        </li>
      {/if}
      <li
          aria-current={page.url.pathname.startsWith("/tarefas")
            ? "page"
            : undefined}
        >
          <a href="/tarefas">Tarefas</a>
        </li>
      {#if hasPermission("verPropostas")}
        <li
          aria-current={page.url.pathname.startsWith("/propostas")
            ? "page"
            : undefined}
        >
          <a href="/propostas">Propostas</a>
        </li>
      {/if}
    </ul>
    <div class="suporte">
      <ul>
        <li>
          <a style="cursor: pointer;" onclick={loggout}>Sair</a>
        </li>
      </ul>
    </div>
  </nav>
</div>

<style>
  .sidebar {
    display: flex;
    flex-flow: column;
    justify-content: center;
    background-color: #363636;
    position: fixed;
    width: 15vw;
    height: 100vh;
    box-shadow: black 0 0 15px;
  }

  .sidebar > * {
    flex: 1;
    overflow: auto;
  }

  nav {
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    flex-flow: column;
    padding: 0;
  }

  li {
    position: relative;
    height: 100%;
    margin-block: 5px;
  }

  nav a {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text-2);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--color-theme-1);
  }
</style>
