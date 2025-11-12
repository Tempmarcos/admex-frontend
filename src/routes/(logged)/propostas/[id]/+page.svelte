<script lang='ts'>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import type { GetProposta, UpdateProposta } from "$lib/types/proposta";
    import { deleteProposta } from "$lib/utils/propostas/deleteProposta";
    import { getProposta } from "$lib/utils/propostas/getProposta";
    import { updateProposta } from "$lib/utils/propostas/updateProposta";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    $: id = page.params.id

    let proposta = writable<GetProposta>();
    let updateData = writable<UpdateProposta>()
    let loading = true;
    let editando = false;
    let mensagem = writable('');
    
    onMount(async () => {
        await carregarProposta();
    });

    async function carregarProposta() {
        try {
            $proposta = await getProposta(id);
            console.log($proposta)
        } catch (err) {
            $mensagem = 'Erro ao carregar dados';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    async function editarProposta() {
        try {
            $updateData= {
                descricao: $proposta.descricao,
                status: $proposta.status
            }
            await updateProposta(id, $updateData);
            editando = false;
            $mensagem = `Proposta editada com sucesso!`
        } catch (err) {
            $mensagem = 'Erro ao salvar alterações';
            console.error(err);
        }
    }

    async function excluir() {
        if(confirm('Tem certeza que deseja excluir esta proposta?')) {
            try {
                await deleteProposta(id);
                goto('/propostas');
            } catch (err) {
                $mensagem = 'Erro ao excluir proposta';
                console.error(err);
            }
        }
    }

    const getStatusColor = (status: string) => {
    switch (status) {
      case 'criada':
        return '#999'; // cinza
      case 'enviada':
        return '#007bff'; // azul
      case 'aprovada':
        return '#28a745'; // verde
      case 'executada':
        return '#6f42c1'; // roxo
      case 'cancelada':
        return '#dc3545'; // vermelho
      default:
        return '#666';
    }
  };
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
    {#if $proposta}
        <div class="header">
            <div class="acoes">
                {#if !editando}
                    <button on:click={() => editando = true}>Editar</button>
                {:else}
                    <button on:click={editarProposta}>Salvar</button>
                    <button on:click={() => editando = false}>Cancelar</button>
                {/if}
                <button class="danger" on:click={excluir}>Excluir</button>
            </div>
        </div>

        <form on:submit|preventDefault={editarProposta}>
            <div class="secao">
                <label>
                    Código:
                    <div class="valor">{$proposta.codigo || 'Não informado'}</div>
                </label>
                <label>
                    Cliente:
                    <div class="valor">{$proposta.cliente.nome || 'Não informado'}</div>
                </label>
                <label>
                    Status:
                    {#if editando}
                        <select name="" id="" bind:value={$proposta.status}>
                            <option value="criada">Criada</option>
                            <option value="enviada">Enviada</option>
                            <option value="aprovada">Aprovada</option>
                            <option value="executada">Executada</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    {:else}
                        <div class="status" style="background-color: {getStatusColor($proposta.status)}">{$proposta.status || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Descrição:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$proposta.descricao}
                            placeholder="Digite o nome do contato"
                        />
                    {:else}
                        <div class="valor">{$proposta.descricao || 'Não informado'}</div>
                    {/if}
                </label>
            </div>
            <h1>Revisões:</h1>
            <div class="secao">
                
            </div>
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

    .status {
    color: #fff;
    text-transform: capitalize;
    padding: 0.25rem 0.6rem;
    border-radius: 5px;
    font-weight: 600;
    width: fit-content;
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