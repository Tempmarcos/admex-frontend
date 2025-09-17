<script lang="ts">
  import { page } from "$app/state";
  import { loggout } from "$lib/utils/loggout";
  import { hasPermission } from "$lib/utils/user/hasPermission";
  import { onMount } from "svelte";
    import { writable } from "svelte/store";

  let sidebarOpen = writable(false);
  let sidebarElement: HTMLElement;
  let theme = $state('dark'); // 'dark' ou 'light'

  // Toggle do sidebar
  function toggleSidebar(event : any) {
    // console.log($sidebarOpen)
    event.stopPropagation();
    sidebarOpen.update((value) => !value);
    // console.log($sidebarOpen)
  }

  // Fechar sidebar ao clicar fora
  function handleClickOutside(event: MouseEvent) {
    if ($sidebarOpen && sidebarElement && !sidebarElement.contains(event.target as Node)) {
      sidebarOpen.set(false);
    }
  }

  // Toggle do tema
  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    // Aqui você pode salvar a preferência no localStorage
    localStorage.setItem('theme', theme);
  }

  // Carregar tema salvo
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      theme = savedTheme;
    }
    
    // Adicionar listener para cliques fora do sidebar
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<!-- Botão toggle do sidebar -->
<button 
  class="sidebar-toggle" 
  onclick={toggleSidebar}
  aria-label="Toggle sidebar"
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</button>

<!-- Overlay para dispositivos móveis -->
{#if $sidebarOpen}
  <div class="sidebar-overlay" onclick={() => $sidebarOpen = false}></div>
{/if}

<!-- Sidebar -->
<div 
  class="sidebar {theme}" 
  class:open={$sidebarOpen}
  bind:this={sidebarElement}
>
  <nav>
    <div class="sidebar-header">
      <div class="logo"></div>
      
      <!-- Botão de fechar no mobile -->
      <button 
        class="close-button mobile-only" 
        onclick={() => $sidebarOpen = false}
        aria-label="Fechar sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <ul class="nav-menu">
      <li aria-current={page.url.pathname === "/inicio" ? "page" : undefined}>
        <a href="/inicio">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Início
        </a>
      </li>
      
      {#if hasPermission("verUsuarios")}
        <li aria-current={page.url.pathname === "/usuarios" ? "page" : undefined}>
          <a href="/usuarios">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 108 0 4 4 0 00-8 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Usuários
          </a>
        </li>
      {/if}
      
      {#if hasPermission('verDados')}
        <li aria-current={page.url.pathname === "/empresa" ? "page" : undefined}>
          <a href="/empresa">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" stroke="currentColor" stroke-width="2"/>
            </svg>
            Empresa
          </a>
        </li>
      {/if}
      
      {#if hasPermission("verItens")}
        <li aria-current={page.url.pathname.startsWith("/itens") ? "page" : undefined}>
          <a href="/itens">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-2v4H8V2h8z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Itens
          </a>
        </li>
      {/if}
      
      {#if hasPermission("verEntidades")}
        <li aria-current={page.url.pathname.startsWith("/relacoes") ? "page" : undefined}>
          <a href="/relacoes">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Relações
          </a>
        </li>
      {/if}
      
      <li aria-current={page.url.pathname.startsWith("/tarefas") ? "page" : undefined}>
        <a href="/tarefas">
          <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 11l3 3 8-8M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.67 0 3.21.46 4.55 1.26" stroke="currentColor" stroke-width="2"/>
          </svg>
          Tarefas
        </a>
      </li>
      
      {#if hasPermission("verPropostas")}
        <li aria-current={page.url.pathname.startsWith("/propostas") ? "page" : undefined}>
          <a href="/propostas">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Propostas
          </a>
        </li>
      {/if}
    </ul>

    <div class="sidebar-footer">
      <!-- Toggle do tema -->
      <button class="theme-toggle" onclick={toggleTheme} title="Alterar tema">
        {#if theme === 'dark'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2"/>
          </svg>
        {/if}
      </button>

      <ul>
        <li>
          <a style="cursor: pointer;" onclick={loggout}>
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2"/>
            </svg>
            Sair
          </a>
        </li>
      </ul>
    </div>
  </nav>
</div>

<style>
  :root {
    --sidebar-width: 280px;
    --sidebar-width-collapsed: 60px;
  }

  /* Botão toggle */
  .sidebar-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: var(--sidebar-bg, #363636);
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    color: var(--sidebar-text, #fff);
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  .sidebar-toggle:hover {
    background: var(--sidebar-hover, #4a4a4a);
    transform: scale(1.05);
  }

  /* Overlay para mobile */
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    animation: fadeIn 0.3s forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; }
  }

  /* Sidebar */
  .sidebar {
    position: fixed !important;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--sidebar-bg, #363636);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.15);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* Temas */
  .sidebar.dark {
    --sidebar-bg: #363636;
    --sidebar-text: #ffffff;
    --sidebar-text-secondary: #b0b0b0;
    --sidebar-hover: #4a4a4a;
    --sidebar-active: #2563eb;
    --sidebar-border: #4a4a4a;
  }

  .sidebar.light {
    --sidebar-bg: #ffffff;
    --sidebar-text: #1f2937;
    --sidebar-text-secondary: #6b7280;
    --sidebar-hover: #f3f4f6;
    --sidebar-active: #3b82f6;
    --sidebar-border: #e5e7eb;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  /* Header do sidebar */
  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--sidebar-border);
  }

  .logo {
    width: 40px;
    height: 40px;
    background: var(--sidebar-active);
    border-radius: 8px;
  }

  .close-button {
    background: none;
    border: none;
    color: var(--sidebar-text);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    display: none;
  }

  .close-button:hover {
    background: var(--sidebar-hover);
  }

  /* Navegação */
  nav {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .nav-menu {
    flex: 1;
    list-style: none;
    padding: 1rem 0;
    margin: 0;
    overflow-y: auto;
  }

  .nav-menu li {
    margin: 0;
  }

  .nav-menu a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: var(--sidebar-text);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-menu a:hover {
    background: var(--sidebar-hover);
    color: var(--sidebar-active);
  }

  .nav-menu li[aria-current="page"] a {
    background: var(--sidebar-active);
    color: white;
  }

  .nav-menu li[aria-current="page"] a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: white;
  }

  .nav-icon {
    margin-right: 0.75rem;
    flex-shrink: 0;
  }

  /* Footer do sidebar */
  .sidebar-footer {
    border-top: 1px solid var(--sidebar-border);
    padding: 1rem;
  }

  .theme-toggle {
    width: 100%;
    background: none;
    border: 1px solid var(--sidebar-border);
    color: var(--sidebar-text);
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    background: var(--sidebar-hover);
    border-color: var(--sidebar-active);
  }

  .sidebar-footer ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-footer a {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    color: var(--sidebar-text-secondary);
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .sidebar-footer a:hover {
    background: var(--sidebar-hover);
    color: var(--sidebar-text);
  }

  /* Responsivo */
  @media (min-width: 768px) {
    .sidebar {
      transform: translateX(0);
      position: relative;
      width: var(--sidebar-width);
    }

    .sidebar-toggle {
      display: none;
    }

    .sidebar-overlay {
      display: none;
    }
  }

  @media (max-width: 767px) {
    .mobile-only {
      display: block !important;
    }
    
    .sidebar {
      width: 100%;
      max-width: 300px;
    }
  }

  /* Scrollbar customizada */
  .nav-menu::-webkit-scrollbar {
    width: 4px;
  }

  .nav-menu::-webkit-scrollbar-track {
    background: transparent;
  }

  .nav-menu::-webkit-scrollbar-thumb {
    background: var(--sidebar-border);
    border-radius: 2px;
  }

  .nav-menu::-webkit-scrollbar-thumb:hover {
    background: var(--sidebar-text-secondary);
  }
</style>