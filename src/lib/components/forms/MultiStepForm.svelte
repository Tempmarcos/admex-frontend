<script>
  import Card from "../Card.svelte";
  import AdminForm from "./AdminForm.svelte";
  import EmpresaForm from "./EmpresaForm.svelte";
  import EnderecoForm from "./EnderecoForm.svelte";
  import '$lib/styles/form.css'
  import ConfirmarForm from "./ConfirmarForm.svelte";
  import { submitCadastroEmpresa } from "$lib/utils/empresa/submitCadastroEmpresa";
  import { validacaoCadastro } from "$lib/stores/cadastroStore";

  let etapa = 1;
  function avancar() {
    if (etapa < 4) etapa += 1;
  }
  function voltar() {
    if (etapa > 1) etapa -= 1;
  }

</script>
<Card height='100%' width='400px'>
  <div class="containerCard">
  {#if etapa === 1}
    <AdminForm />
    <span><button disabled={!$validacaoCadastro.user} on:click={avancar}>Avançar</button></span>
  {:else if etapa === 2}
    <EmpresaForm />
    <span><button on:click={voltar}>Voltar</button>
    <button disabled={!$validacaoCadastro.dadosFiscais} on:click={avancar}>Avançar</button></span>
  {:else if etapa === 3}
    <EnderecoForm />
    <span><button on:click={voltar}>Voltar</button>
    <button disabled={!$validacaoCadastro.dadosGerais} on:click={avancar}>Avançar</button></span>
  {:else if etapa === 4}
    <ConfirmarForm />
    <span><button on:click={voltar}>Voltar</button>
    <button disabled={!$validacaoCadastro.completo} on:click={submitCadastroEmpresa}>Cadastrar</button></span>
  {/if}
  </div>
</Card>
<style>
  .containerCard {
    display: flex;
    flex-flow: column;
  }
</style>