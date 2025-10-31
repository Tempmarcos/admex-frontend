<script lang="ts">
  import { goto } from "$app/navigation";
    import AddButton from "$lib/components/buttons/AddButton.svelte";
  import RelacaoCard from "$lib/components/forms/RelacaoCard.svelte";
  import { tipoRelacao } from "$lib/stores/cadastroStore";
  import { getEntidades } from "$lib/utils/relacoes/getEntidades";
  import { hasPermission } from "$lib/utils/user/hasPermission";
  import { onMount } from "svelte";
  

  let clientes : {id: string, nome: string}[] | [] = [];
  let fornecedores : {id: string, nome: string}[] | [] = [];

  let loadingClientes = false
  let loadingFornecedores = false

  

  onMount(async() => {
    loadingClientes = true
    loadingFornecedores = true
    clientes = await getEntidades('cliente');
    loadingClientes = false
    fornecedores = await getEntidades('fornecedor');
    loadingFornecedores = false
  })

  async function handleGetRelacao(tipo: string ,id: string) {
    tipoRelacao.set(tipo)
    goto(`/relacoes/${id}`)
  }
</script>

<svelte:head>
  <title>Página Inicial</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#if hasPermission('adicionarItens')}
    <AddButton onClick={goto('/relacoes/criar')} texto={'+ Nova Relação'}></AddButton>
  {/if}
  <div>
    <h1>Clientes:</h1>
    <div class="container">
      {#if loadingClientes}
        <h1>Carregando clientes...</h1>
      {/if}
      {#each clientes as cliente}
        <RelacaoCard nome={cliente.nome} 
          onClickGet={async() => handleGetRelacao('cliente', cliente.id)}></RelacaoCard>
      {/each}
    </div>
  </div>
  <div>
    <h1>Serviços:</h1>
    <div class="container">
      {#if loadingFornecedores}
        <h1>Carregando fornecedores...</h1>
      {/if}
      {#each fornecedores as fornecedor}
        <RelacaoCard nome={fornecedor.nome}
          onClickGet={async() => handleGetRelacao('fornecedor', fornecedor.id)}></RelacaoCard>
      {/each}
    </div>
  </div>
  
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    flex: 0.6;
    min-height: 100vh;
    background-color: #d9d9d9;
  }
   h1 {
    margin-bottom: 1rem;
    color: #333;
  }

  .container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    width: 100%;
    max-width: 1000px;
  }
</style>
