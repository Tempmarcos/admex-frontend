<script lang="ts">
  import Card from "$lib/components/Card.svelte";
    import { getEmpresa } from "$lib/utils/empresa/getEmpresa";
  import { usuarioLogado } from "$lib/utils/login";
  import { onMount } from "svelte";
  

  let empresa : { 
    DadosFinanceiros: {
      contaBancaria: string
  },
    DadosFiscais: {
      camposEspecificos: any,
      classificacao: string,
      registro: string
    },
    DadosGerais: {
      dataDeFundacao: string
      endereco: any,
      logo: any,
      nome: string,
      nomeFantasia: string
    },
    dataCadastro: string,
    usuarios: [{id: string, nome:string}]
};

  onMount(async ()=> {
    empresa = await getEmpresa();
    console.log(empresa)
  })
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
    min-width: 100vw;
    background-color: #d9d9d9;
  }
</style>
