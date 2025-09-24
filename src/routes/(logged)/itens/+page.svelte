<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import ItemCard from "$lib/components/ItemCard.svelte";
  import { createItem } from "$lib/utils/itens/createItem";
    import { deleteItem } from "$lib/utils/itens/deleteItem";
  import { getItem } from "$lib/utils/itens/getItem";
  import { getItens } from "$lib/utils/itens/getItens";
    import { updateItem } from "$lib/utils/itens/updateItem";
  import { usuarioLogado } from "$lib/utils/login";
    import { hasPermission } from "$lib/utils/user/hasPermission";
  import { onMount } from "svelte";
  

  let produtos : {id: string, nome: string}[] | [] = [];
  let servicos : {id: string, nome: string}[] | [] = [];

  let showModal = false;
  let tipoSelecionado = "produto";
  let editing = false

  let loadingDelete = false;
  let loadingCreate = false;
  let loadingUpdate = false;
  let loadingGet = false;
  let loadingProdutos = false
  let loadingServicos = false
  // dados temporários para criação
  let novoItem = {
    nome: "",
    tipo: "venda",
    descricao: "",
    preco: 0,
  };

  let currentId = '';

  onMount(async() => {
    loadingProdutos = true
    loadingServicos = true
    produtos = await getItens('produto');
    loadingProdutos = false
    servicos = await getItens('servico');
    loadingServicos = false
  })

  async function salvarItem() {
    await createItem(tipoSelecionado, novoItem);
    if (tipoSelecionado === "produto") {
      produtos = await getItens("produto");
    } else {
      servicos = await getItens("servico");
    }
    showModal = false;
    novoItem = { nome: "", tipo: "venda", descricao: "", preco: 0};
  }

  async function editarItem() {
    await updateItem(tipoSelecionado, currentId, novoItem);
    if (tipoSelecionado === "produto") {
      produtos = await getItens("produto");
    } else {
      servicos = await getItens("servico");
    }
    showModal = false;
    novoItem = { nome: "", tipo: "venda", descricao: "", preco: 0};
  }

  async function handleGetItem(tipo: string ,id: string) {
    currentId = id;
    let item = await getItem(tipo, id)
    console.log(item)
    editing = true;
    tipoSelecionado = tipo
    showModal = true;
    novoItem = {nome: item.nome, tipo: item.tipo, descricao: item.descricao, preco: item.preco};
  }

  async function handleDeleteItem(tipo: string, id: string){
    await deleteItem(tipo, id);
    if (tipo === "produto") {
      produtos = await getItens("produto");
    } else {
      servicos = await getItens("servico");
    }
  }

  function closeModal(){
    showModal = false;
    editing = false;
    tipoSelecionado= 'produto';
    novoItem = { nome: "", tipo: "venda", descricao: "", preco: 0};
  }
</script>

<svelte:head>
  <title>Página Inicial</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#if hasPermission('adicionarItens')}
    <button class="add-btn" on:click={() => (showModal = true)}>+ Novo Item</button>
  {/if}
  <div>
    <h1>Produtos:</h1>
    <div class="container">
      {#if loadingProdutos}
        <h1>Carregando produtos...</h1>
      {/if}
      {#each produtos as produto}
        <ItemCard nome={produto.nome} onClickDelete={async() =>handleDeleteItem('produto', produto.id)} 
          onClickGet={async() => handleGetItem('produto', produto.id)}></ItemCard>
      {/each}
    </div>
  </div>
  <div>
    <h1>Serviços:</h1>
    <div class="container">
      {#if loadingServicos}
        <h1>Carregando serviços...</h1>
      {/if}
      {#each servicos as servico}
        <ItemCard nome={servico.nome} onClickDelete={async() =>handleDeleteItem('servico', servico.id)}
          onClickGet={async() => handleGetItem('servico', servico.id)}></ItemCard>
      {/each}
    </div>
  </div>
  {#if showModal}
    <div class="modal-backdrop" on:click={() => closeModal()}></div>
    <div class="modal">
      {#if !editing}
      <p>Criar novo item</p>
        <label>
          Tipo:
          <select bind:value={tipoSelecionado} >
            <option value="produto">Produto</option>
            <option value="servico">Serviço</option>
          </select>
        </label>
      {/if}
      {#if tipoSelecionado === "produto"}
        {#if editing}
        <form on:submit|preventDefault={editarItem}>
          <label for="nome">Nome:</label>
          <input placeholder="Nome" bind:value={novoItem.nome} id="nome" required />
          <label for="descricao">Descrição:</label>
          <textarea placeholder="Descrição" bind:value={novoItem.descricao}></textarea>
          <label for="preco">Preço:</label>
          <input type="number" step="0.01" placeholder="Preço" bind:value={novoItem.preco} />
          {#if hasPermission('editarItens')}
            <button type="submit">Salvar Produto</button>
          {/if}
        </form>
        {:else}
        <form on:submit|preventDefault={salvarItem}>
          <label for="nome">Nome:</label>
          <input placeholder="Nome" bind:value={novoItem.nome} id="nome" required />
          <label for="descricao">Descrição:</label>
          <textarea placeholder="Descrição" bind:value={novoItem.descricao}></textarea>
          <label for="preco">Preço:</label>
          <input type="number" step="0.01" placeholder="Preço" bind:value={novoItem.preco} />
          <button type="submit">Salvar Produto</button>
        </form>
        {/if}
      {:else}
        {#if editing}
        <form on:submit|preventDefault={editarItem}>
          <label for="nome">Nome:</label>
          <input placeholder="Nome" bind:value={novoItem.nome} id="nome" required />
          <label for="descricao">Descrição:</label>
          <textarea placeholder="Descrição" bind:value={novoItem.descricao}></textarea>
          <label for="preco">Preço:</label>
          <input type="number" step="0.01" placeholder="Preço" bind:value={novoItem.preco} />
          {#if hasPermission('editarItens')}
            <button type="submit">Salvar Serviço</button>
          {/if}
        </form>
        {:else}
        <form on:submit|preventDefault={salvarItem}>
          <input placeholder="Nome" bind:value={novoItem.nome} required />
          <textarea placeholder="Descrição" bind:value={novoItem.descricao}></textarea>
          <input type="number" step="0.01" placeholder="Preço" bind:value={novoItem.preco} />
          <button type="submit">Salvar Serviço</button>
        </form>
        {/if}
      {/if}
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

  .add-btn {
    background: #0077ff;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .add-btn:hover {
    background: #005fcc;
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
