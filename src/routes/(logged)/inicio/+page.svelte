<script>
  import Card from "$lib/components/Card.svelte";
  import { usuarioLogado } from "$lib/utils/login";
  
</script>

<svelte:head>
  <title>Página Inicial</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <Card>
    <h1>Bem-vindo {$usuarioLogado.nome}</h1>
  </Card>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
    min-height: 100vh;
    /* min-width: 100vw; */
    background-color: #d9d9d9;
  }
</style>
