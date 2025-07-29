<script>
  import Card from "../Card.svelte";
  import AdminForm from "./AdminForm.svelte";
  import EmpresaForm from "./EmpresaForm.svelte";
  import EnderecoForm from "./EnderecoForm.svelte";

  let etapa = 1;
  function avancar() {
    if (etapa < 3) etapa += 1;
  }
  function voltar() {
    if (etapa > 1) etapa -= 1;
  }
</script>
<Card height='100%' width='400px'>
  {#if etapa === 1}
    <AdminForm />
    <button on:click={avancar}>Avançar</button>
  {:else if etapa === 2}
    <EmpresaForm />
    <button on:click={voltar}>Voltar</button>
    <button on:click={avancar}>Avançar</button>
  {:else if etapa === 3}
    <EnderecoForm />
    <button on:click={voltar}>Voltar</button>
  {/if}
</Card>
<style>
  select {
    padding: 5px;
    max-width: 200px;
  }
  span {
    display: flex;
    justify-content: center;
  }
  button {
    padding: 10px;
    margin: 5px;
    border: none;
    background-color: chartreuse;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: rgb(89, 176, 1);
  }
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
  .container {
    height: 100%;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .container form {
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  form input,
  form select {
    margin-bottom: 10px;
  }
  .title {
    color: white;
    font-size: 3.6rem;
  }
  .sair {
    position: fixed;
    left: 1vw;
    top: 1vh;
  }
  .sair a {
    text-decoration: none;
    color: white;
  }
  form div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    margin-bottom: 10px;
  }
</style>