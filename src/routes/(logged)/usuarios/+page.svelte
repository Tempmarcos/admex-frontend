<script>
  import Card from "$lib/components/Card.svelte";
  import { usuario, token } from "$lib/stores/auth";
  import { BASE_URL } from "../../api";

  //FAZER FETCH DOS USERS
  async function getUsers() {
    try {
      let tokenValue;
      token.subscribe((value) => {
        tokenValue = value;
      });
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "users", {
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
      return dados;
    } catch (error) {
      console.log(error);
    }
  }
  getUsers();
</script>

<svelte:head>
  <title>Usuários</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section></section>

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
</style>
