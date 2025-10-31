<script lang='ts'>
    import AddButton from "$lib/components/buttons/AddButton.svelte";
  import Card from "$lib/components/Card.svelte";
  import TarefaCard from "$lib/components/TarefaCard.svelte";
  import type { ListTarefa } from "$lib/types/tarefa";
  import { usuarioLogado } from "$lib/utils/login";
    import { createTarefa } from "$lib/utils/tarefas/createTarefa";
    import { deletarTarefa } from "$lib/utils/tarefas/deletarTarefa";
    import { getTarefa } from "$lib/utils/tarefas/getTarefa";
  import { getTarefas } from "$lib/utils/tarefas/getTarefas";
    import { updateTarefa } from "$lib/utils/tarefas/updateTarefa";
  import { getUsers } from "$lib/utils/user/getUsers";
  import { hasPermission } from "$lib/utils/user/hasPermission";
  import { onMount } from "svelte";
    import { writable } from "svelte/store";
  

  let users : {id: string, nome: string}[] | [] = [];
  // let tarefas : ListTarefa[] | [] = [];
  let tarefas = writable<ListTarefa[] | []>([])

  let showModal = false;
  let editing = false
  let hasData = false;

  let novaTarefa = {
    nome: "",
    descricao: "",
    responsavelId: "",
    tipo: "",
    dataAgendada: ""
  };

  let tarefaEditada = {
    nome: "",
    descricao: "",
    status: "",
    tipo: "",
    responsavelId: "",
    dataAgendada: ""
  }

  let currentId = '';

  onMount(async ()=> {
    users = await getUsers();
    tarefas.set(await getTarefas());
  })

  function closeModal(){
    showModal = false;
    editing = false;
    hasData= false;
    novaTarefa = { nome: "", tipo: "", descricao: "", responsavelId: "", dataAgendada: ""};
  }

  async function salvarTarefa() {
    const payload = {
    ...novaTarefa,
    dataAgendada: novaTarefa.dataAgendada && hasData
      ? new Date(novaTarefa.dataAgendada).toISOString()
      : null
    }
    await createTarefa(payload);
    tarefas.set(await getTarefas());
    showModal = false;
    hasData= false;
    novaTarefa = { nome: "", tipo: "", descricao: "", responsavelId: "", dataAgendada: ""};
  }

  async function editarTarefa() {
    const payload = {
    ...tarefaEditada,
    dataAgendada: tarefaEditada.dataAgendada && hasData
      ? new Date(tarefaEditada.dataAgendada).toISOString()
      : null
    }
    await updateTarefa(currentId, payload);
    tarefas.set(await getTarefas());
    showModal = false;
    hasData= false;
    tarefaEditada = { nome: "", tipo: "", descricao: "", responsavelId: "", dataAgendada: "", status: ""}
  }

  async function handleGetTarefa(id: string) {
    currentId = id;
    let tarefa = await getTarefa(id)
    console.log(tarefa)
    editing = true;
    tarefa.dataAgendada ? hasData = true : hasData = false;
    showModal = true;
    tarefaEditada = {nome: tarefa.nome, status: tarefa.status, tipo: tarefa.tipo, 
      descricao: tarefa.descricao, responsavelId: tarefa.responsavel.id, 
      dataAgendada: tarefa.dataAgendada ? tarefa.dataAgendada.split("T")[0] : ""};
  }

  async function handleDeleteTarefa(id: string){
    await deletarTarefa(id)
    tarefas.set(await getTarefas());
    showModal = false;
    novaTarefa = { nome: "", tipo: "", descricao: "", responsavelId: "", dataAgendada: ""};
  }
</script>

<svelte:head>
  <title>Tarefas</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#if hasPermission('adicionarItens')}
    <AddButton onClick={() => showModal = true} texto={'+ Nova Tarefa'}></AddButton>
  {/if}
  <h1>Suas tarefas:</h1>
  <div class="tarefaContainer">
    {#each $tarefas as tarefa (tarefa.id)}
      <TarefaCard onClick={async () => handleGetTarefa(tarefa.id)} nome={tarefa.nome} criador={tarefa.criador.nome}
      responsavel={tarefa.responsavel.nome} status={tarefa.status} dataAgendada={tarefa.dataAgendada}></TarefaCard>
    {/each}
  </div>
  {#if showModal}
    <div class="modal-backdrop" on:click={() => closeModal()}></div>
    <div class="modal">
      {#if !editing}
      <p>Criar nova tarefa</p>
      {/if}
        {#if editing}
        <form on:submit|preventDefault={editarTarefa}>
            <label for="nome">
              Nome:
              <input placeholder="Nome" bind:value={tarefaEditada.nome} required />
            </label>
            <label>
              Tipo:
              <select bind:value={tarefaEditada.tipo} required>
                <option value="">Selecionar opção</option>
                <option value="tarefa">Tarefa</option>
                <option value="servico">Serviço</option>
                <option value="compra">Compra</option>
                <option value="proposta">Proposta</option>
              </select>
            </label>
            <label>
              Status:
              <select bind:value={tarefaEditada.status} required>
                <option value="atrasada">Atrasada</option>
                <option value="pendente">Pendente</option>
                <option value="executada">Executada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </label>
            <label for="descricao">
              Descrição:
              <textarea placeholder="Descrição" bind:value={tarefaEditada.descricao}></textarea>
            </label>
            <label>
              Responsável:
              <select bind:value={tarefaEditada.responsavelId} required>
                <option value="">Selecionar opção</option>
                {#each users as user}
                  <option value={user.id}>{user.nome}</option>
                {/each}
              </select>
            </label>
            {#if !hasData}
              <label for="hasData">
                Data agendada?
                <input type="checkbox" bind:checked={hasData} name="hasData" id="">
              </label>
            {/if}
            {#if hasData}
              <label for="dataAgendada">
                Data agendada:
                <input type="date" name="dataAgendada" bind:value={tarefaEditada.dataAgendada} id="" required min={new Date().toISOString().split("T")[0]}>
                <input type="checkbox" bind:checked={hasData} name="hasData" id="">
              </label>
            {/if}
            <button type="submit">Editar Tarefa</button>
            <button class="delete" on:click={()=> handleDeleteTarefa(currentId)}>Deletar Tarefa</button>
          </form>
        {:else}
          <form on:submit|preventDefault={salvarTarefa}>
            <label for="nome">
              Nome:
              <input placeholder="Nome" bind:value={novaTarefa.nome} required />
            </label>
            <label>
              Tipo:
              <select bind:value={novaTarefa.tipo} required>
                <option value="">Selecionar opção</option>
                <option value="tarefa">Tarefa</option>
                <option value="servico">Serviço</option>
                <option value="compra">Compra</option>
                <option value="proposta">Proposta</option>
              </select>
            </label>
            <label for="descricao">
              Descrição:
              <textarea placeholder="Descrição" bind:value={novaTarefa.descricao}></textarea>
            </label>
            <label>
              Responsável:
              <select bind:value={novaTarefa.responsavelId} required>
                <option value="">Selecionar opção</option>
                {#each users as user}
                  <option value={user.id}>{user.nome}</option>
                {/each}
              </select>
            </label>
            {#if !hasData}
              <label for="hasData">
                Data agendada?
                <input type="checkbox" bind:checked={hasData} name="hasData" id="">
              </label>
            {/if}
            {#if hasData}
              <label for="dataAgendada">
                Data agendada:
                <input type="date" name="dataAgendada" bind:value={novaTarefa.dataAgendada} id="" required min={new Date().toISOString()}>
                <input type="checkbox" bind:checked={hasData} name="hasData" id="">
              </label>
            {/if}
            <button type="submit">Salvar Tarefa</button>
          </form>
        {/if}
    </div>
  {/if}
</section>
<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
    min-height: 100vh;
    padding-block: 10px;
    /* min-width: 100vw; */
    background-color: #d9d9d9;
  }

  .tarefaContainer {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-evenly;
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

  .delete {
    background-color: rgb(184, 51, 51);
    color: white;
    border: none;
    cursor: pointer;
    transition: 0.1s;
    padding-block: 5px;
  }
  .delete:hover{
    filter:grayscale(0.3);
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
