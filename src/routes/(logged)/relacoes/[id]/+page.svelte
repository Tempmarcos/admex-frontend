<script lang='ts'>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { cepInputErro, cidades, estados, tipoRelacao } from "$lib/stores/cadastroStore";
    import { type CreateEntidade, type GetEntidade } from "$lib/types/entidade";
    import { fetchCidades } from "$lib/utils/empresa/fetchCidades";
    import { fetchCodigoPostal } from "$lib/utils/empresa/fetchCodigoPostal";
    import { fetchEstados } from "$lib/utils/empresa/fetchEstados";
    import { deleteEntidade } from "$lib/utils/relacoes/deleteEntidade";
    import { getEntidade } from "$lib/utils/relacoes/getEntidade";
    import { updateEntidade } from "$lib/utils/relacoes/updateEntidade";
    import { onDestroy, onMount } from "svelte";
    import { writable } from "svelte/store";
    
    

    $: id = page.params.id
    if(!$tipoRelacao) goto('/relacoes')

    let entidade = writable<GetEntidade>();
    let updateData = writable<CreateEntidade>()
    let loading = true;
    let editando = false;
    let mensagem = writable('');
     $: erroCep = $cepInputErro;
    let debounceTimeout: number | undefined;
    

    async function processarCep(codigo_postal: string) {
        const cep = codigo_postal.toString()
        if (cep.length === 8) {
            const resposta = await fetchCodigoPostal(cep);
            cepInputErro.set("");;
            if (resposta) {
                entidade.update((dados : any) => ({
                    ...dados,
                    endereco: {
                        ...dados.endereco,
                        dados: {
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

    onMount(async () => {
        await carregarEntidade();
        await fetchEstados();
        await fetchCidades($entidade.endereco.dados.estado)
    });

    async function carregarEntidade() {
        try {
            $entidade = await getEntidade($tipoRelacao, id);
            console.log($entidade)
        } catch (err) {
            $mensagem = 'Erro ao carregar dados';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function salvar() {
        try {
            $updateData= {
                nome: $entidade.nome,
                registro: $entidade.registro,
                contato: $entidade.contato,
                endereco: {
                    pais: $entidade.endereco.pais,
                    codigoPostal: $entidade.endereco.dados.codigoPostal,
                    estado: $entidade.endereco.dados.estado,
                    cidade: $entidade.endereco.dados.cidade,
                    logradouro: $entidade.endereco.dados.logradouro,
                    numero: $entidade.endereco.dados.numero,
                    complemento: $entidade.endereco.dados.complemento
                },
                dadosFinanceiros: $entidade.dadosFinanceiros
            }
            await updateEntidade($tipoRelacao, id, $updateData);
            editando = false;
            $mensagem = `${$tipoRelacao} editado com sucesso!`
        } catch (err) {
            $mensagem = 'Erro ao salvar alterações';
            console.error(err);
        }
    }

    async function excluir() {
        if(confirm('Tem certeza que deseja excluir esta relação?')) {
            try {
                await deleteEntidade($tipoRelacao, id);
                goto('/relacoes');
            } catch (err) {
                $mensagem = 'Erro ao excluir relação';
                console.error(err);
            }
        }
    }
</script>
<svelte:head>
  <title>Relação</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
<div class="container">
    {#if loading}
        <p>Carregando...</p>
    {/if}
    {#if $mensagem}
        <div class="message" class:success={$mensagem.includes('sucesso')} class:error={$mensagem.includes('Erro')}>
            {$mensagem}
        </div>
    {/if}
    {#if $entidade}
        <div class="header">
            <h1>{$tipoRelacao === 'cliente' ? 'Cliente' : 'Fornecedor'}</h1>
            <div class="acoes">
                {#if !editando}
                    <button on:click={() => editando = true}>Editar</button>
                {:else}
                    <button on:click={salvar}>Salvar</button>
                    <button on:click={() => editando = false}>Cancelar</button>
                {/if}
                <button class="danger" on:click={excluir}>Excluir</button>
            </div>
        </div>

        <form on:submit|preventDefault={salvar}>
            <div class="secao">
                <h2>Informações Básicas</h2>
                <label>
                    Nome:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.nome}
                            placeholder="Digite o nome"
                        />
                    {:else}
                        <div class="valor">{$entidade.nome || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    CPF/CNPJ:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.registro}
                            placeholder="Digite o CPF ou CNPJ"
                        />
                    {:else}
                        <div class="valor">{$entidade.registro || 'Não informado'}</div>
                    {/if}
                </label>
            </div>

            <div class="secao">
                <h2>Contato</h2>
                <label>
                    Nome:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.contato.nome}
                            placeholder="Digite o nome do contato"
                        />
                    {:else}
                        <div class="valor">{$entidade.contato.nome || 'Não informado'}</div>
                    {/if}
                </label>
                
                <label>
                    Cargo:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.contato.cargo}
                            placeholder="Digite o cargo"
                        />
                    {:else}
                        <div class="valor">{$entidade.contato.cargo || 'Não informado'}</div>
                    {/if}
                </label>

                <label>
                    E-mail:
                    {#if editando}
                        <input 
                            type="email" 
                            bind:value={$entidade.contato.email}
                            placeholder="Digite o e-mail"
                        />
                    {:else}
                        <div class="valor">{$entidade.contato.email || 'Não informado'}</div>
                    {/if}
                </label>

                <label>
                    Telefone:
                    {#if editando}
                        <input 
                            type="tel" 
                            bind:value={$entidade.contato.telefone}
                            placeholder="Digite o telefone"
                        />
                    {:else}
                        <div class="valor">{$entidade.contato.telefone || 'Não informado'}</div>
                    {/if}
                </label>
            </div>

            <div class="secao">
                <h2>Endereço</h2>
                <label>
                    CEP:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.endereco.dados.codigoPostal}
                            placeholder="Digite o país"
                            on:input={handleCepInput}
                        />
                        {#if erroCep}
                            <p id="cep-status" style="margin-block: 0;">{erroCep}</p>
                        {/if}
                    {:else}
                        <div class="valor">{$entidade.endereco.dados.codigoPostal || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Estado:
                    {#if editando}
                        <select name="estado" id="estado" required on:change={fetchCidades} bind:value={$entidade.endereco.dados.estado}>
                            <option value="">Selecione</option>
                            {#each $estados as estado}
                                <option value={estado.sigla}>{estado.nome}</option>
                            {/each}
                        </select>
                    {:else}
                        <div class="valor">{$entidade.endereco.dados.estado || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Cidade:
                    {#if editando}
                        <select name="cidade" id="cidade" required bind:value={$entidade.endereco.dados.cidade}>
                            <option value="">Selecione</option>
                            {#each $cidades as cidade}
                                <option value={cidade.nome}>{cidade.nome}</option>
                            {/each}
                        </select>
                    {:else}
                        <div class="valor">{$entidade.endereco.dados.cidade || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Logradouro:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.endereco.dados.logradouro}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{$entidade.endereco.dados.logradouro || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Número:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.endereco.dados.numero}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{$entidade.endereco.dados.numero || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Complemento:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$entidade.endereco.dados.complemento}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{$entidade.endereco.dados.complemento || 'Não informado'}</div>
                    {/if}
                </label>
            </div>

            {#if $tipoRelacao === 'fornecedor' && $entidade.dadosFinanceiros}
                <div class="secao">
                    <h2>Dados Financeiros</h2>
                    <label>
                        Banco:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={$entidade.dadosFinanceiros.banco}
                                placeholder="Digite o banco"
                            />
                        {:else}
                            <div class="valor">{$entidade.dadosFinanceiros.banco || 'Não informado'}</div>
                        {/if}
                    </label>

                    <label>
                        Agência:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={$entidade.dadosFinanceiros.agencia}
                                placeholder="Digite a agência"
                            />
                        {:else}
                            <div class="valor">{$entidade.dadosFinanceiros.agencia || 'Não informado'}</div>
                        {/if}
                    </label>

                    <label>
                        Conta:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={$entidade.dadosFinanceiros.conta}
                                placeholder="Digite o número da conta"
                            />
                        {:else}
                            <div class="valor">{$entidade.dadosFinanceiros.conta || 'Não informado'}</div>
                        {/if}
                    </label>

                    <label>
                        PIX:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={$entidade.dadosFinanceiros.pix}
                                placeholder="Digite a chave PIX"
                            />
                        {:else}
                            <div class="valor">{$entidade.dadosFinanceiros.pix || 'Não informado'}</div>
                        {/if}
                    </label>
                </div>
            {/if}
        </form>
    {/if}
</div>
</section>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }

    .acoes {
        display: flex;
        gap: 10px;
    }

    button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button.danger {
        background-color: #ff4444;
        color: white;
    }

    .secao {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }

    label {
        display: block;
        margin-bottom: 15px;
    }

    input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .valor {
        padding: 8px 0;
        color: #666;
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
    input, select {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }

    input:focus, select:focus {
        outline: none;
        border-color: #4CAF50;
    }
</style>