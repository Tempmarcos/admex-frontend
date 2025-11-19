<script lang='ts'>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { dadosCadastro } from "$lib/stores/cadastroStore";
    import { type CreateRevisao, type GetProposta, type revisao, type UpdateProposta } from "$lib/types/proposta";
    import { getItens } from "$lib/utils/itens/getItens";
    import { deleteProposta } from "$lib/utils/propostas/deleteProposta";
    import { getProposta } from "$lib/utils/propostas/getProposta";
    import { createRevisao } from "$lib/utils/propostas/revisoes/createRevisao";
    import { updateProposta } from "$lib/utils/propostas/updateProposta";
    import { getEntidades } from "$lib/utils/relacoes/getEntidades";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    
    $: id = page.params.id

    let proposta = writable<GetProposta>();
    let updateData = writable<UpdateProposta>()
    let produtos : {id: string, nome: string}[] | [] = [];
    let servicos : {id: string, nome: string}[] | [] = [];
    let clientes : {id: string, nome: string}[] | [] = [];
    let loading = true;
    let editando = false;
    let mensagem = writable('');
    let showModal = false;

    let mostrarMenuCriar = false;
    let criandoRevisao = writable<boolean>(false);
    let novaRevisao= writable<CreateRevisao>({
        propostaId: id,
        dataProposta: new Date().toISOString().split('T')[0],
        valorTotal: 0,
        itens: []
    })

    let indiceAtual = 1;
    let revisaoAtual: revisao | null = null;

    
    onMount(async () => {
        await carregarProposta();
        produtos = await getItens('produto');
        servicos = await getItens('servico');
    });

    function closeModal(){
        showModal = false;
        $criandoRevisao = false;
        novaRevisao.update((dados) => ({
            ...dados,
            dataProposta: new Date().toISOString().split('T')[0],
            valorTotal: 0,
            itens: []
        }));
  }

    async function carregarProposta() {
        try {
            $proposta = await getProposta(id);
            if ($proposta.revisoes.length > 0) {
                revisaoAtual = $proposta.revisoes[0];
                indiceAtual = 0;
            }
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
                status: $proposta.status,
                endereco: $proposta.endereco,
                tituloProjeto: $proposta.tituloProjeto
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

  //REVISÕES

  function iniciarCriacaoDoZero() {
        $criandoRevisao = true;
        $novaRevisao = {
            propostaId: id,
            dataProposta: new Date().toISOString().split('T')[0],
            valorTotal: 0,
            itens: []
        };
        showModal = true;
        console.log(criandoRevisao)
        mostrarMenuCriar = false;
    }

    function iniciarCopiaAtual() {
        if (!revisaoAtual) return;
        $novaRevisao = {
            propostaId: id,
            dataProposta: new Date().toISOString().split('T')[0],
            valorTotal: parseFloat(revisaoAtual.valorTotal),
            itens: revisaoAtual.itens.map(item => ({ ...item }))
        };
        $criandoRevisao = true;
        showModal = true;
        mostrarMenuCriar = false;
    }

    async function iniciarCriarNovaProposta() {
        clientes = await getEntidades('cliente');
        $criandoRevisao = false;
        showModal= true;
    }

  async function salvarRevisao() {
        try {
            await createRevisao(id, $novaRevisao);
            $mensagem = 'Revisão criada com sucesso!';
            $criandoRevisao = false;
            await carregarProposta();
        } catch (err) {
            $mensagem = 'Erro ao criar revisão';
            console.error(err);
        }
    }

    function cancelarCriacao() {
        $criandoRevisao = false;
        novaRevisao.update((dados) => ({
            ...dados,
            dataProposta: new Date().toISOString().split('T')[0],
            valorTotal: 0,
            itens: []
        }));
    }

    //ITENS

     function adicionarItem() {
        $novaRevisao.itens = [...$novaRevisao.itens, { 
            nome: '', 
            preco: '0', 
            quantidade: 1, 
            unidadeDeMedida: 'Unid' 
        }];
    }

    function removerItem(index: number) {
        $novaRevisao.itens = $novaRevisao.itens.filter((_, i) => i !== index);
    }

    function calcularValorTotal() {
        const total = $novaRevisao.itens.reduce((sum, item) => {
            return sum + (parseFloat(item.preco || '0') * item.quantidade);
        }, 0);
        $novaRevisao.valorTotal = parseFloat(total.toFixed(2));
    }

    function formatarValor(valor: string) {
        return parseFloat(valor).toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }

    async function mudarPagina(index: number) {
        indiceAtual = index;
        revisaoAtual = $proposta.revisoes[index];
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
                    Título do projeto:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$proposta.tituloProjeto}
                            placeholder="Digite o título do projeto"
                        />
                    {:else}
                        <div class="valor">{$proposta.tituloProjeto || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Endereço:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$proposta.endereco}
                            placeholder="Digite o endereço em uma linha"
                        />
                    {:else}
                        <div class="valor">{$proposta.endereco || 'Não informado'}</div>
                    {/if}
                </label>
                <label>
                    Descrição:
                    {#if editando}
                        <input 
                            type="text" 
                            bind:value={$proposta.descricao}
                            placeholder="Digite a descrição"
                        />
                    {:else}
                        <div class="valor">{$proposta.descricao || 'Não informado'}</div>
                    {/if}
                </label>
            </div>
        </form>
        <h1>Revisões:</h1>
        <div class="secao">
            {#if $proposta.revisoes.length > 0}
                {#each $proposta.revisoes as revisoes}

                {/each}
                <div class="menu-criar">
                    <button class="btn-criar" on:click={() => mostrarMenuCriar = !mostrarMenuCriar}>
                        + Nova Revisão
                    </button>
                    {#if mostrarMenuCriar}
                        <div class="dropdown">
                            <button on:click={iniciarCriacaoDoZero}>Criar do Zero</button>
                            <button on:click={iniciarCopiaAtual}>Copiar Última Versão</button>
                        </div>
                    {/if}
                </div>
                {:else}
                <div class="empty-state">
                    <p>Nenhuma revisão criada ainda</p>
                    <button class="btn-criar-principal" on:click={iniciarCriacaoDoZero}>
                        + Criar Primeira Revisão
                    </button>
                </div>
            {/if}
        </div>
        {#if showModal}
            <div class="modal-backdrop" on:click={() => closeModal()}></div>
            <div class="modal">
            {#if $criandoRevisao}
            <h3>Nova Revisão</h3>
            <form on:submit|preventDefault={salvarRevisao}>
                <label>
                        Data da Proposta:
                        <input type="date" bind:value={$novaRevisao.dataProposta} />
                    </label>
                    <label>
                        Valor Total:
                        <input 
                            type="text" 
                            value={$novaRevisao.valorTotal}
                            
                        />
                    </label>
                <div class="itens-section">
                    <div class="itens-header">
                        <h4>Itens</h4>
                        <button type="button" class="btn-adicionar" on:click={adicionarItem}>
                            + Adicionar Item
                        </button>
                    </div>

                    {#each $novaRevisao.itens as item, index}
                        <div class="item-card">
                            <div class="item-grid">
                                <label>
                                    Nome:
                                    <input 
                                        type="text" 
                                        bind:value={item.nome}
                                        placeholder="Nome do item"
                                    />
                                </label>
                                <label>
                                    Preço:
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        bind:value={item.preco}
                                        on:input={calcularValorTotal}
                                    />
                                </label>
                                <label>
                                    Quantidade:
                                    <input 
                                        type="number" 
                                        bind:value={item.quantidade}
                                        on:input={calcularValorTotal}
                                    />
                                </label>
                                <label>
                                    Unidade:
                                    <input 
                                        type="text" 
                                        bind:value={item.unidadeDeMedida}
                                        placeholder="un, m², kg..."
                                    />
                                </label>
                            </div>
                            <button 
                                type="button" 
                                class="btn-remover" 
                                on:click={() => removerItem(index)}
                            >
                                Remover
                            </button>
                        </div>
                    {/each}
                <button type="submit">Salvar Revisão</button>
            </form>
            {:else}
                //criar nova proposta usando o revisaoatual
            {/if}
            </div>
        {/if}
    {/if}
</div>
</section>

<style>

    .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 10;
    width: 90%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
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