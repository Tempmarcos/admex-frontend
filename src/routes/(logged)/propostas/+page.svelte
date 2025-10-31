<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { usuarioLogado } from "$lib/utils/login";
    import { getPropostas } from "$lib/utils/propostas/getPropostas";
    import { onMount } from "svelte";
  
  let propostas : {id: string, nome: string}[] | [] = []

  onMount(async () => {
    propostas = await getPropostas();
  })
</script>

<svelte:head>
  <title>Propostas</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  {#each propostas as proposta}
    <div>
      <h1>{proposta.nome}</h1>
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
    background-color: #d9d9d9;
  }
</style>
