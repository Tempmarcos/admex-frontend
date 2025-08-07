<script>
  import Card from "../Card.svelte";
  import AdminForm from "./AdminForm.svelte";
  import EmpresaForm from "./EmpresaForm.svelte";
  import EnderecoForm from "./EnderecoForm.svelte";
  import '$lib/styles/form.css'

  let etapa = 1;
  function avancar() {
    if (etapa < 3) etapa += 1;
  }
  function voltar() {
    if (etapa > 1) etapa -= 1;
  }
</script>
<Card height='100%' width='400px'>
  <div class="containerCard">
  {#if etapa === 1}
    <AdminForm />
    <span><button on:click={avancar}>Avançar</button></span>
  {:else if etapa === 2}
    <EmpresaForm />
    <span><button on:click={voltar}>Voltar</button>
    <button on:click={avancar}>Avançar</button></span>
  {:else if etapa === 3}
    <EnderecoForm />
    <span><button on:click={voltar}>Voltar</button></span>
  {/if}
  </div>
</Card>
<style>
  .containerCard {
    display: flex;
    flex-flow: column;
  }
</style>