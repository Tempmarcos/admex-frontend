<script lang="ts">
    import { goto } from "$app/navigation";
    import AddButton from "$lib/components/buttons/AddButton.svelte";
    import PropostaCard from "$lib/components/PropostaCard.svelte";
    import type { ListProposta } from "$lib/types/proposta";
    import { createProposta } from "$lib/utils/propostas/createProposta";
    import { getProposta } from "$lib/utils/propostas/getProposta";
    import { getPropostas } from "$lib/utils/propostas/getPropostas";
    import { getEntidades } from "$lib/utils/relacoes/getEntidades";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
  
  // let propostas : {id: string, nome: string}[] | [] = []
  let propostas = writable<ListProposta[] | []>([])
  let clientes : {id: string, nome: string}[] | [] = [];

  let loadingClientes = false
  let showModal = false;
  let novaProposta = {
    clienteId: "",
    status: "",
    tituloProjeto: "",
    descricao: "",
  };

  function closeModal(){
    showModal = false;
    novaProposta = { clienteId: "", status: "", descricao: "", tituloProjeto: ""};
  }

  async function salvarProposta() {
    await createProposta(novaProposta);
    propostas.set(await getPropostas());
    showModal = false;
    novaProposta = { clienteId: "", status: "", descricao: "", tituloProjeto: ""};
  }

  onMount(async () => {
    propostas.set(await getPropostas())
    clientes = await getEntidades('cliente');
  })
</script>

<svelte:head>
  <title>Propostas</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <AddButton texto={'Adicionar proposta +'} onClick={() => showModal = true}></AddButton>
  {#each $propostas as proposta}
    <PropostaCard
      codigo={proposta.codigo}
      status={proposta.status}
      cliente={proposta.cliente.nome}
      onClickGet={() => goto(`/propostas/${proposta.id}`)}
    ></PropostaCard>
  {/each}

  {#if showModal}
    <div class="modal-backdrop" on:click={() => closeModal()}></div>
    <div class="modal">
      <form on:submit|preventDefault={salvarProposta}>
        <label>
          Cliente:
          <select bind:value={novaProposta.clienteId} required>
            <option value="">Selecionar opção</option>
            {#each clientes as cliente}
              <option value={cliente.id}>{cliente.nome}</option>
            {/each}
          </select>
        </label>
        <label for="tituloProjeto">
          Título do projeto:
          <input placeholder="Título" type="text" bind:value={novaProposta.tituloProjeto}>
        </label>
        <label for="descricao">
          Descrição:
          <textarea placeholder="Descrição" bind:value={novaProposta.descricao}></textarea>
        </label>
        <button type="submit">Salvar Proposta</button>
      </form>
    </div>
  {/if}
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

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal {
    position: fixed;
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  input, textarea, select {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 0.95rem;
  }

  button[type="submit"] {
    background: #28a745;
    color: white;
    border: none;
    padding: 0.7rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
  }
  button[type="submit"]:hover {
    background: #218838;
  }
</style>
