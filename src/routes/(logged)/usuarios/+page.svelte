<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { gerarLink } from "$lib/utils/user/gerarLink";
  import { getUsers } from "$lib/utils/user/getUsers";
  import { hasPermission } from "$lib/utils/user/hasPermission";
  import { onMount } from "svelte";

  let users : {id: string, nome: string}[] | [] = [];
  let link = '';
  async function handleGerarLink(){
    link = await gerarLink();
  }
  onMount(async ()=> {
    users = await getUsers();
  })
</script>
<svelte:head>
  <title>Usuários</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#if hasPermission("criarUsuarios")}
    <div class="addUser">
      <h1>Adicionar usuário</h1>
      <button onclick={handleGerarLink}>Gerar Link</button>
      <input id="link" type="text" readonly value={link}/>
    </div>
  {/if}
  <h1>Usuários:</h1>
  {#each users as user}
    <div class="userCard">
      <h1>{user.nome}</h1>
      {#if hasPermission("verInfoUsuario")}
        <a href={`/usuarios/${user.id}`}>Ver detalhes</a>
      {/if}
    </div>
  {/each}
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
    min-height: 100vh;
    min-width: 100vw;
    background-color: #d9d9d9;
  }

  .userCard,
  .addUser {
    background-color: white;
    padding: 10px;
    border-radius: 15px;
  }

  .addUser {
    background-color: rgb(138, 138, 138);
  }
</style>
