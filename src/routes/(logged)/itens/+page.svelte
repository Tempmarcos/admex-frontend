<script>
  import Card from "$lib/components/Card.svelte";
  import { tokenLogin, usuarioLogado } from "$lib/utils/login";
  import { hasPermission } from "$lib/utils/user/hasPermission";
  import { BASE_URL } from "../../api";

  let itens = [];

  //FAZER FETCH DOS USERS
  async function getItens() {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "itens", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      });
      // if (!response.ok) {
      //   throw new Error("Erro na requisição: " + response.status);
      // }
      const dados = await response.json();
      console.log(dados);
      itens = dados.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.log(error);
    }
  }
  getItens();
</script>

<svelte:head>
  <title>Usuários</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#if hasPermission("criarUsuarios")}
    <div class="addUser">
      <h1>Adicionar usuário</h1>
      <button>Gerar Link</button>
      <input type="text" readonly />
    </div>
  {/if}
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
