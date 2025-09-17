<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { getEmpresa } from "$lib/utils/empresa/getEmpresa";
  import { usuarioLogado } from "$lib/utils/login";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import '$lib/styles/form.css'
  import { updateDadosFiscais } from "$lib/utils/empresa/updateDadosFiscais";
  import { updateDadosGerais } from "$lib/utils/empresa/updateDadosGerais";
  import { fetchCidades } from "$lib/utils/empresa/fetchCidades";
  import { cepInputErro, cidades, estados } from "$lib/stores/cadastroStore";
  import { fetchEstados } from "$lib/utils/empresa/fetchEstados";
  import { fetchCodigoPostal } from "$lib/utils/empresa/fetchCodigoPostal";
  
let empresa = writable<IGetEmpresa>({
  DadosFinanceiros: {
      contaBancaria: ''
  },
    DadosFiscais: {
      camposEspecificos: {
        naturezaJuridica: '',
        regimeTributario: ''
      },
      classificacao: '',
      registro: ''
    },
    DadosGerais: {
      dataDeFundacao: '',
      endereco: {
        pais: 'BR',
        cidade: '',
        codigoPostal: '',
        estado: '',
        logradouro: '',
        numero: '',
        complemento: ''
      },
      logo: '',
      nome: '',
      nomeFantasia: ''
    },
    dataCadastro: '',
    usuarios: [{id: '', nome: ''}]
  })

  function toInputDate(dateString?: string): string {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0] // "2022-11-01"
}

  function normalizarEmpresa(empresa: Partial<IGetEmpresa>): IGetEmpresa {
  return {
    DadosFinanceiros: {
      contaBancaria: empresa.DadosFinanceiros?.contaBancaria ?? ''
    },
    DadosFiscais: {
      camposEspecificos: {
        naturezaJuridica: empresa.DadosFiscais?.camposEspecificos?.naturezaJuridica ?? '',
        regimeTributario: empresa.DadosFiscais?.camposEspecificos?.regimeTributario ?? ''
      },
      classificacao: empresa.DadosFiscais?.classificacao ?? '',
      registro: empresa.DadosFiscais?.registro ?? ''
    },
    DadosGerais: {
      dataDeFundacao: toInputDate(empresa.DadosGerais?.dataDeFundacao),
      endereco: {
        pais: empresa.DadosGerais?.endereco?.pais ?? 'BR',
        cidade: empresa.DadosGerais?.endereco?.dados.cidade ?? '',
        codigoPostal: empresa.DadosGerais?.endereco?.dados.codigoPostal ?? '',
        complemento: empresa.DadosGerais?.endereco?.dados.complemento ?? '',
        estado: empresa.DadosGerais?.endereco?.dados.estado ?? '',
        logradouro: empresa.DadosGerais?.endereco?.dados.logradouro ?? '',
        numero: empresa.DadosGerais?.endereco?.dados.numero ?? '',
      },
      logo: empresa.DadosGerais?.logo ?? '',
      nome: empresa.DadosGerais?.nome ?? '',
      nomeFantasia: empresa.DadosGerais?.nomeFantasia ?? ''
    },
    dataCadastro: empresa.dataCadastro ?? '',
    usuarios: empresa.usuarios ?? [{ id: '', nome: '' }]
  }
}

let loading = writable(false)
let loadingDadosGerais = writable(false)
let loadingDadosFiscais = writable(false)
let messageDadosGerais = writable('')
let messageDadosFiscais = writable('')

  async function handleUpdateDadosGerais(dadosGerais: any){
    $loadingDadosGerais = true
    try{
      const payload = {
      ...dadosGerais,
      dataDeFundacao: dadosGerais.dataDeFundacao
        ? new Date(dadosGerais.dataDeFundacao).toISOString()
        : null
    }
      await updateDadosGerais(payload)
      $messageDadosGerais = 'Dados Gerais alterados com sucesso'
      $loadingDadosGerais = false
    }catch(error){ 
      $messageDadosGerais = 'Erro ao alterar os Dados Gerais'
      $loadingDadosGerais = false
    }
  }

  $: erroCep = $cepInputErro;

   let debounceTimeout: number | undefined;

  async function processarCep(codigo_postal: string) {
    const cep = codigo_postal.toString()
    if (cep.length === 8) {
    const resposta = await fetchCodigoPostal(cep);
    cepInputErro.set("");;
    if (resposta) {
        empresa.update((dados) => ({
            ...dados,
            DadosGerais: {...dados.DadosGerais,
                endereco: {
                    ...dados.DadosGerais.endereco,
                      logradouro: resposta.street,
                      estado: resposta.state,
                      cidade: resposta.city
                }
            }
        }))

        await fetchCidades(resposta.state);
    }
    } else {
    cepInputErro.set("Digite um CEP válido.");
    }
}

  function handleCepInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(() => {
      processarCep(val);
    }, 500);
  }

  onDestroy(() => {
    clearTimeout(debounceTimeout);
  });

  async function handleUpdateDadosFiscais(dadosFiscais: any){
    $loadingDadosFiscais = true
    try{
      await updateDadosFiscais(dadosFiscais)
      $messageDadosFiscais = 'Dados Fiscais alterados com sucesso'
      $loadingDadosFiscais = false
    }catch(error){ 
      $messageDadosFiscais = 'Erro ao alterar os Dados Fiscais'
      $loadingDadosFiscais = false
    }
  }

  onMount(async() => {
    $loading = true
    $empresa = normalizarEmpresa(await getEmpresa());
    $loading = false
    console.log($empresa)
    await fetchEstados();
    await fetchCidades($empresa.DadosGerais.endereco.estado)
  })

</script>

<svelte:head>
  <title>Página Inicial</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <Card>
    <div class="container">
      {#if $loading}
        <h1>Carregando dados...</h1>
      {:else if $empresa}
      <label for="dataCadastro">Data de cadastro:</label>
      <input type="text" readonly value={new Date($empresa.dataCadastro).toLocaleDateString("pt-BR")}>
        <form action="">
          <h1>Dados Gerais:</h1>
          <label for="nomeEmpresa">Razão Social</label>
          <input type="text" name="nomeEmpresa" id="nomeEmpresa" bind:value={$empresa.DadosGerais.nome} required />
          <label for="nomeFantasia">Nome fantasia</label>
          <input type="text" name="nomeFantasia" id="nomeFantasia" bind:value={$empresa.DadosGerais.nomeFantasia} required />
          <label for="dataFundacao">Data de fundação</label>
          <input type="date" name="dataFundacao" id="dataFundacao" bind:value={$empresa.DadosGerais.dataDeFundacao} required />
          <p>Endereço:</p>
          <label for="cep">CEP</label>
         <input
        type="number"
        name="cep"
        id="cep"
        minlength="8"
        maxlength="8"
        required
        bind:value={$empresa.DadosGerais.endereco.codigoPostal}
        oninput={handleCepInput}
        />
        {#if erroCep}
            <p id="cep-status" style="margin-block: 0;">{erroCep}</p>
        {/if}
        <label for="estado">Estado</label>
        <select name="estado" id="estado" required onchange={fetchCidades} bind:value={$empresa.DadosGerais.endereco.estado}>
        <option value="">Selecione</option>
        {#each $estados as estado}
            <option value={estado.sigla}>{estado.nome}</option>
        {/each}
        </select>
        <label for="cidade">Cidade</label>
        <select name="cidade" id="cidade" required bind:value={$empresa.DadosGerais.endereco.cidade}>
        <option value="">Selecione</option>
        {#each $cidades as cidade}
            <option value={cidade.nome}>{cidade.nome}</option>
        {/each}
        </select>
        <label for="logradouro">Logradouro</label>
        <input type="text" name="logradouro" id="logradouro" required bind:value={$empresa.DadosGerais.endereco.logradouro}/>
        <label for="numero">Número</label>
        <input type="text" id="numero" name="numero" required bind:value={$empresa.DadosGerais.endereco.numero}/>
        <label for="complemento">Complemento</label>
        <input type="text" name="complemento" id="complemento" bind:value={$empresa.DadosGerais.endereco.complemento}/>
        <button disabled={$loadingDadosGerais} onclick={() => handleUpdateDadosGerais($empresa.DadosGerais)}>Editar Dados Gerais</button>
          {#if $messageDadosGerais}
		        <div class="message" class:success={$messageDadosGerais.includes('sucesso')} class:error={$messageDadosGerais.includes('Erro')}>
			      {$messageDadosGerais}
            </div>
          {/if}
      </form>
        <form action="">
          <h1>Dados Fiscais:</h1>
          <label for="registro">CPNJ:</label>
          <input type="text" id="registro"
          maxlength="14"
          minlength="14" 
          bind:value={$empresa.DadosFiscais.registro}>
          <label for="registro">CNAE:</label>
          <input type="text" id="classificacao" bind:value={$empresa.DadosFiscais.classificacao}>
          <label for="registro">Natureza Jurídica:</label>
          <input type="text" id="classificacao"
          placeholder="Ex: 2222"
          maxlength="4"
           bind:value={$empresa.DadosFiscais.camposEspecificos.naturezaJuridica}>
          <label for="regime">Regime Tributário</label>
          <select id="regime" name="regime" bind:value={$empresa.DadosFiscais.camposEspecificos.regimeTributario} required>
          <option value="">Selecione</option>
          <option value="mei">MEI - Microempreendedor Individual</option>
          <option value="simples">Simples Nacional</option>
          <option value="presumido">Lucro Presumido</option>
          <option value="real">Lucro Real</option>
          </select>
          <button disabled={$loadingDadosFiscais} onclick={() => handleUpdateDadosFiscais($empresa.DadosFiscais)}>Editar Dados Fiscais</button>
          {#if $messageDadosFiscais}
		        <div class="message" class:success={$messageDadosFiscais.includes('sucesso')} class:error={$messageDadosFiscais.includes('Erro')}>
			      {$messageDadosFiscais}
            </div>
          {/if}
        </form>
        {:else}
        <h1>Erro</h1>
      {/if}
    </div>
  </Card>
</section>

<style>
  section {
    flex: 0.6;
    min-height: 100vh;
    background-color: #d9d9d9;
  }

  .container form {
    display: flex;
    flex-flow: column;
  }

  form input {
    margin-bottom: 10px;
  }

  .message {
		padding: 12px;
		border-radius: 4px;
		margin-bottom: 15px;
		font-weight: 500;
	}

	.message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}
</style>
