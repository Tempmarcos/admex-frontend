<script lang="ts">
  import { page } from "$app/state";
  import { hasPermission } from "$lib/utils/user/hasPermission";
</script>

<div class="sidebar">
  <div class="logo"></div>
  <nav>
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
    </ul>
  </nav>
  <div class="suporte"></div>
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
  }

  .sidebar > * {
    flex: 1;
    overflow: auto;
  }

  nav {
    display: flex;
    justify-content: center;
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
