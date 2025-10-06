<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { login } from "$lib/utils/login";

  const handleSubmit = (event : any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email === "string" && typeof password === "string") {
      login(email, password);
    }
  };
</script>

<main>
  <Card>
    <div class="form">
      <h1>Admex</h1>
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
        <em>Não tem conta? Faça seu <a href="/cadastro" data-sveltekit-preload-data="tap">cadastro</a></em>
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
    width: 400px;
    height: 300px;
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
    transform: translate(-75px, -20px);
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
  form input:focus,
  form input:valid,
  form input:not(:placeholder-shown) {
    border-bottom: 1px solid transparent;
  }

  form input {
    border: none;
    border-bottom: 1px solid black;
    padding: 2px;
    width: 200px;
    outline: none;
  }

  form a {
    color: #ff3e00;
    text-decoration: none;
  }
</style>
