<script lang="ts">
  // @ts-nocheck

  import Card from "$lib/components/Card.svelte";
  import { localStorageStore } from "$lib/stores/localStorageStore";
  import { BASE_URL } from "./api";
  import { goto } from "$app/navigation";

  const usuario = localStorageStore<{
    nome: string;
    id: number;
    email: string;
    permissoes: Array;
    created_at: string;
    updatedAt: string;
    perfil: object;
  }>("usuario", {
    id: 0,
    nome: "",
    email: "",
    permissoes: [],
    created_at: "",
    updatedAt: "",
    perfil: {},
  });

  const token = localStorageStore<string>("token", "");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // console.log(email, password);
    const data = JSON.stringify({
      email: email,
      senha: password,
    });
    // console.log(data);
    login(data);
  };

  async function login(data) {
    try {
      const response = await fetch(BASE_URL + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      const dados = await response.json();
      const user = dados.loginResponse;
      $usuario = {
        id: user.id,
        nome: user.nome,
        perfil: user.perfil,
        permissoes: user.permissoes,
        created_at: user.created_at,
        updatedAt: user.updatedAt,
      };

      $token = user.token;
      console.log("Dados recebidos:", dados);
      await goto("/inicio");
    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
    }
  }
</script>

<main>
  <Card width="400px" , height="300px">
    <div class="form">
      <h1>Nome: {$usuario.nome}</h1>
      <form on:submit={handleSubmit}>
        <input type="email" name="email" id="email" required placeholder="" />
        <label for="email">E-mail</label>
        <input
          type="password"
          name="password"
          id="password"
          minlength="6"
          required
          placeholder=""
        />
        <label for="password">Senha</label>
        <button type="submit">Enviar</button>
        <em>Não tem conta? Faça seu <a href="/inicio">cadastro</a></em>
      </form>
    </div>
  </Card>
</main>

<style>
  main {
    height: 100%;
    height: 100vh;
    width: 100%;
    background-color: #363636;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }
  .form form {
    display: flex;
    flex-flow: column;
    align-items: center;
  }

  form label {
    transform: translate(-80px, -20px);
    /* transform: translateX(-80px); */
    pointer-events: none;
    transition: 1s;
  }

  form input:focus + label,
  form input:valid + label,
  form input:not(:placeholder-shown) + label {
    transform: translate(-80px, -40px);
    color: black;
  }

  form input {
    border: 0px 0px 0px 0px solid black;
    width: 200px;
    outline: none;
  }
</style>
