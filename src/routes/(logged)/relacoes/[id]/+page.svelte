<script lang='ts'>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { tipoRelacao } from "$lib/stores/cadastroStore";
    import type { GetEntidade } from "$lib/types/entidade";
    import { deleteEntidade } from "$lib/utils/relacoes/deleteEntidade";
    import { getEntidade } from "$lib/utils/relacoes/getEntidade";
    import { updateEntidade } from "$lib/utils/relacoes/updateEntidade";
    import { onMount } from "svelte";
    
    

    $: id = page.params.id
    if(!$tipoRelacao) goto('/relacoes')

    let entidade: GetEntidade | null = null;
    let loading = true;
    let editando = false;
    let erro = '';
    

    onMount(async () => {
        await carregarEntidade();
    });

    async function carregarEntidade() {
        try {
            entidade = await getEntidade($tipoRelacao, id);
        } catch (err) {
            erro = 'Erro ao carregar dados';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function salvar() {
        try {
            await updateEntidade($tipoRelacao, id, entidade);
            editando = false;
            await carregarEntidade(); // Recarrega dados atualizados
        } catch (err) {
            erro = 'Erro ao salvar alterações';
            console.error(err);
        }
    }

    async function excluir() {
        if(confirm('Tem certeza que deseja excluir esta relação?')) {
            try {
                await deleteEntidade($tipoRelacao, id);
                goto('/relacoes');
            } catch (err) {
                erro = 'Erro ao excluir relação';
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
    {:else if erro}
        <div class="erro">{erro}</div>
    {:else if entidade}
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
                            bind:value={entidade.nome}
                            placeholder="Digite o nome"
                        />
                    {:else}
                        <div class="valor">{entidade.nome || 'Não informado'}</div>
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
                            bind:value={entidade.contato.nome}
                            placeholder="Digite o nome do contato"
                        />
                    {:else}
                        <div class="valor">{entidade.contato.nome || 'Não informado'}</div>
                    {/if}
                </label>
                
                <label>
                    Cargo:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={entidade.contato.cargo}
                            placeholder="Digite o cargo"
                        />
                    {:else}
                        <div class="valor">{entidade.contato.cargo || 'Não informado'}</div>
                    {/if}
                </label>

                <label>
                    E-mail:
                    {#if editando}
                        <input 
                            type="email" 
                            bind:value={entidade.contato.email}
                            placeholder="Digite o e-mail"
                        />
                    {:else}
                        <div class="valor">{entidade.contato.email || 'Não informado'}</div>
                    {/if}
                </label>

                <label>
                    Telefone:
                    {#if editando}
                        <input 
                            type="tel" 
                            bind:value={entidade.contato.telefone}
                            placeholder="Digite o telefone"
                        />
                    {:else}
                        <div class="valor">{entidade.contato.telefone || 'Não informado'}</div>
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
                            bind:value={entidade.endereco.dados.codigoPostal}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{entidade.endereco.dados.codigoPostal || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Estado:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={entidade.endereco.pais}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{entidade.endereco.pais || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    País:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={entidade.endereco.pais}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{entidade.endereco.pais || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    País:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={entidade.endereco.pais}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{entidade.endereco.pais || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    País:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={entidade.endereco.pais}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{entidade.endereco.pais || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    País:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={entidade.endereco.pais}
                            placeholder="Digite o país"
                        />
                    {:else}
                        <div class="valor">{entidade.endereco.pais || 'Não informado'}</div>
                    {/if}
                </label>
            </div>

            {#if $tipoRelacao === 'fornecedor' && entidade.dadosFinanceiros}
                <div class="secao">
                    <h2>Dados Financeiros</h2>
                    <label>
                        Banco:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={entidade.dadosFinanceiros.banco}
                                placeholder="Digite o banco"
                            />
                        {:else}
                            <div class="valor">{entidade.dadosFinanceiros.banco || 'Não informado'}</div>
                        {/if}
                    </label>

                    <label>
                        Agência:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={entidade.dadosFinanceiros.agencia}
                                placeholder="Digite a agência"
                            />
                        {:else}
                            <div class="valor">{entidade.dadosFinanceiros.agencia || 'Não informado'}</div>
                        {/if}
                    </label>

                    <label>
                        Conta:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={entidade.dadosFinanceiros.conta}
                                placeholder="Digite o número da conta"
                            />
                        {:else}
                            <div class="valor">{entidade.dadosFinanceiros.conta || 'Não informado'}</div>
                        {/if}
                    </label>

                    <label>
                        PIX:
                        {#if editando}
                            <input 
                                type="text" 
                                bind:value={entidade.dadosFinanceiros.pix}
                                placeholder="Digite a chave PIX"
                            />
                        {:else}
                            <div class="valor">{entidade.dadosFinanceiros.pix || 'Não informado'}</div>
                        {/if}
                    </label>
                </div>
            {/if}

            {#if $tipoRelacao === 'cliente' && entidade.propostas}
                <div class="secao">
                    <h2>Propostas</h2>
                    {#each entidade.propostas as proposta}
                        <div class="proposta">
                            <strong>{proposta.titulo || 'Título não informado'}</strong>
                            <span>Status: {proposta.status}</span>
                        </div>
                    {/each}
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

    input, textarea {
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

    .erro {
        color: red;
        margin-bottom: 15px;
    }

    .proposta {
        padding: 10px;
        border: 1px solid #eee;
        margin-bottom: 10px;
        border-radius: 4px;
    }
</style>