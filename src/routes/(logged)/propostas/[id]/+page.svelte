<script lang='ts'>
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { dadosCadastro } from "$lib/stores/cadastroStore";
    import { type CreateRevisao, type GetProposta, type revisao, type UpdateProposta } from "$lib/types/proposta";
    import { createItem } from "$lib/utils/itens/createItem";
    import { getItem } from "$lib/utils/itens/getItem";
    import { getItens } from "$lib/utils/itens/getItens";
    import { createProposta } from "$lib/utils/propostas/createProposta";
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
    let mensagemItem = writable<Record<number, string>>({});
    let mensagemModal = writable('');
    let showModal = false;

    let mostrarMenuCriar = false;
    let criandoRevisao = writable<boolean>(false);
    let novaRevisao= writable<CreateRevisao>({
        propostaId: id,
        dataProposta: new Date().toISOString().split('T')[0],
        valorTotal: 0,
        itens: []
    })

    let novaProposta = {
        clienteId: "",
        status: "",
        tituloProjeto: "",
        descricao: "",
    };

    let indiceAtual = 1;
    let revisaoAtual: revisao | null = null;
    let produtoAtual = "";
    let servicoAtual= "";

    
    onMount(async () => {
        await carregarProposta();
        produtos = await getItens('produto');
        servicos = await getItens('servico');
    });

    function closeModal(){
        showModal = false;
        novaProposta = { clienteId: "", status: "", descricao: "", tituloProjeto: ""};
  }

  async function salvarProposta() {
    if(!revisaoAtual) return
    const payload = {
        clienteId: novaProposta.clienteId,
        status: novaProposta.status,
        descricao: novaProposta.descricao,
        tituloProjeto: novaProposta.tituloProjeto,
        revisao: {
            dataProposta: revisaoAtual.dataProposta,
            valorTotal: revisaoAtual.valorTotal,
            itens: revisaoAtual.itens.map(i => ({
                nome: i.nome,
                preco: i.preco,
                quantidade: i.quantidade,
                unidadeDeMedida: i.unidadeDeMedida
            }))
        }
    }
    try{
        await createProposta(payload);
        $mensagemModal = "Proposta salva com sucesso!"
    }catch(error: any){
        $mensagemModal = "Erro ao salvar proposta"
    }
  }

    async function carregarProposta() {
        try {
            $proposta = await getProposta(id);
            if ($proposta.revisoes.length > 0) {
                const ultimoIndice = $proposta.revisoes.length - 1;
                revisaoAtual = $proposta.revisoes[ultimoIndice];
                indiceAtual = ultimoIndice;
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
        $criandoRevisao = !$criandoRevisao;
        $novaRevisao = {
            propostaId: id,
            dataProposta: new Date().toISOString().split('T')[0],
            valorTotal: 0,
            itens: []
        };
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
        mostrarMenuCriar = false;
    }

    async function iniciarCriarNovaProposta() {
        clientes = await getEntidades('cliente');
        $criandoRevisao = false;
        showModal= true;
    }

  async function salvarRevisao() {
        const payload = {
            ...$novaRevisao,
            dataProposta: $novaRevisao.dataProposta ? 
            new Date($novaRevisao.dataProposta).toISOString()
            : null,
            itens: $novaRevisao.itens.map(({ novoItem, ...item }) => item)
        }
        try {
            await createRevisao(id, payload);
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
            unidadeDeMedida: 'Unid',
            novoItem: true
        }];
    }

    async function adicionarItemLista(tipo: string, id: string){
        produtoAtual = ""
        servicoAtual = ""
        if(!id) return
        let item = await getItem(tipo, id);
        $novaRevisao.itens = [...$novaRevisao.itens, { 
            nome: item.nome, 
            preco: item.preco, 
            quantidade: 1, 
            unidadeDeMedida: 'Unid'
        }];
        calcularValorTotal()
    }

    async function criarItemForaDaLista(index: number, tipo: string){
        if (!tipo) return;
        mensagemItem.update(m => ({ ...m, [index]: 'Salvando…' }));
        const { novoItem, ...itemParaAPI } = $novaRevisao.itens[index];

        // adiciona os campos extras
        const payload: any = {
            ...itemParaAPI,
            tipo: 'venda',
            descricao: 'Descrição Padrão'
        };  

        try{
            await createItem(tipo, payload);
            mensagemItem.update(m => ({ ...m, [index]: 'Item adicionado com sucesso!' }));
            $novaRevisao.itens[index] = {
                ...$novaRevisao.itens[index],
                novoItem: false,
            };
            $novaRevisao.itens = $novaRevisao.itens;
        }catch(e: any){
            mensagemItem.update(m => ({ ...m, [index]: 'Erro ao adicionar item no sistema' }));
        }
    }

    function removerItem(index: number) {
        mensagemItem.update(m => {
            const novo = { ...m };
            delete novo[index];
            return novo;
        });
        $novaRevisao.itens = $novaRevisao.itens.filter((_, i) => i !== index);
        calcularValorTotal()
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

    function formatarData(data: string) {
        return new Date(data).toLocaleDateString('pt-BR');
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
            <h1>Proposta {$proposta.codigo}</h1>
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
        <div class="revisoes-header">
            <h1>Revisões</h1>
            {#if $proposta.revisoes.length > 0}
                <div class="menu-criar">
                    <button class="btn-criar" on:click={() => mostrarMenuCriar = !mostrarMenuCriar}>
                        Criar...
                    </button>
                    {#if mostrarMenuCriar}
                        <div class="dropdown">
                            <button on:click={iniciarCriacaoDoZero}>Revisão do Zero</button>
                            <button on:click={iniciarCopiaAtual}>Revisão Copiando Atual</button>
                            <button on:click={iniciarCriarNovaProposta}>Nova Proposta Usando Essa Revisão</button>
                            <button on:click={iniciarCriarNovaProposta}>PDF Com a Revisão Atual</button>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
        <div class="secao">
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
                            type="number"
                            bind:value={$novaRevisao.valorTotal}
                            
                        />
                    </label>
                    <div class="itens-section">
                        <div class="itens-header">
                            <h3>Itens</h3>
                            <span class="itens-select">
                                <select name="" id="" bind:value={produtoAtual} on:change={(e) => adicionarItemLista('produto' , (e.target as HTMLSelectElement).value)}>
                                    <option value="">Produto</option>
                                    {#each produtos as produto}
                                        <option value={produto.id}>{produto.nome}</option>
                                    {/each}
                                </select>
                                <select name="" id="" bind:value={servicoAtual} on:change={(e) => adicionarItemLista('servico' , (e.target as HTMLSelectElement).value)}>
                                    <option value="">Serviço</option>
                                    {#each servicos as servico}
                                        <option value={servico.id}>{servico.nome}</option>
                                    {/each}
                                </select>
                            </span>
                            <h4>ou</h4>
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
                                {#if item.novoItem}
                                    <div class="criar-item">
                                        <select name="" id="" on:change={(e) => criarItemForaDaLista(index, (e.target as HTMLSelectElement).value)}>
                                            <option value="">Adicionar como...</option>
                                            <option value="produto">Produto</option>
                                            <option value="servico">Servico</option>
                                        </select>
                                    </div>
                                {/if}
                                {#if $mensagemItem[index]}
                                    <div class="message" class:success={$mensagemItem[index].includes('sucesso')} class:error={$mensagemItem[index].includes('Erro')}>
                                        {$mensagemItem[index]}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                    <button type="submit">Salvar Revisão</button>
                    <button class="danger" on:click={cancelarCriacao}>Cancelar</button>
                </form>
            {/if}
            {#if $proposta.revisoes.length === 0 && !$criandoRevisao}
                <div class="empty-state">
                    <p>Nenhuma revisão criada ainda</p>
                    <button class="btn-criar-principal" on:click={iniciarCriacaoDoZero}>
                        + Criar Primeira Revisão
                    </button>
                </div>
            {:else if !$criandoRevisao}
                <!-- Seletor de Revisões (Quadradinhos) -->
                <div class="revisoes-selector">
                    {#each $proposta.revisoes.slice().reverse() as revisao, index}
                        <button 
                            class="revisao-quadrado"
                            class:ativo={indiceAtual === $proposta.revisoes.length -1 - index}
                            on:click={() => mudarPagina($proposta.revisoes.length -1 - index)}
                        >
                            <div class="versao">V{revisao.numeroRevisao ?? $proposta.revisoes.length - index}</div>
                        </button>
                    {/each}
                </div>
                <!-- Detalhes da Revisão Selecionada -->
                {#if revisaoAtual}
                    <div class="revisao-detalhes">
                        <div class="revisao-header-card">
                            <div>
                                <h2>Revisão {revisaoAtual.numeroRevisao || indiceAtual + 1}</h2>
                                <span class="data">
                                    Data proposta:
                                    {formatarData(revisaoAtual.dataProposta)}
                                </span>
                            </div>
                            <div class="revisao-acoes">
                                <span class="valor-total">{formatarValor(revisaoAtual.valorTotal)}</span>
                            </div>
                        </div>
                        
                        <div class="itens-lista">
                            <h3>Itens da Revisão ({revisaoAtual.itens.length})</h3>
                            <div class="itens-grid">
                                {#each revisaoAtual.itens as item}
                                    <div class="item-resumo">
                                        <div class="item-info">
                                            <span class="item-nome">{item.nome}</span>
                                            <span class="item-detalhes">
                                                {item.quantidade} {item.unidadeDeMedida || 'un'} × {formatarValor(item.preco)}
                                            </span>
                                        </div>
                                        <span class="item-total">
                                            {formatarValor((parseFloat(item.preco) * item.quantidade).toString())}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
                {#if showModal}
                    <div class="modal-backdrop" on:click={() => closeModal()}></div>
                    <div class="modal">
                        <form on:submit|preventDefault={salvarProposta}>
                            <label>
                            Cliente:
                            <select bind:value={novaProposta.clienteId} required>
                                <option value="">Selecionar opção</option>
                                {#each clientes as cliente}
                                <option value={cliente.id}>{cliente.nome}</option>
                                {/each}
                            </select>
                            </label>
                            <label for="tituloProjeto">
                            Título do projeto:
                            <input placeholder="Título" type="text" bind:value={novaProposta.tituloProjeto}>
                            </label>
                            <label for="descricao">
                            Descrição:
                            <textarea placeholder="Descrição" bind:value={novaProposta.descricao}></textarea>
                            </label>
                            <button type="submit">Salvar Proposta</button>
                            {#if $mensagemModal}
                                <div class="message" class:success={$mensagemModal.includes('sucesso')} class:error={$mensagemModal.includes('Erro')}>
                                    {$mensagemModal}
                                </div>
                            {/if}
                        </form>
                    </div>
                {/if}
            {/if}
        </div>
    {/if}
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
        max-width: 900px;
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
        transition: all 0.2s;
    }

    button:hover {
        opacity: 0.9;
    }

    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    button.danger {
        background-color: #ff4444;
    }

    .secao {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fafafa;
    }

    label {
        display: block;
        margin-bottom: 15px;
        font-weight: 500;
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

    /* Estilos das Revisões */
    .revisoes-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 40px 0 20px;
    }

    .revisoes-header h1 {
        margin: 0;
    }

    .menu-criar {
        position: relative;
    }

    .btn-criar {
        background-color: #007bff;
        color: white;
    }

    .dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 5px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 10;
        min-width: 200px;
    }

    .dropdown button {
        display: block;
        width: 100%;
        text-align: left;
        padding: 10px 15px;
        background: white;
        color: #333;
        border: none;
        border-radius: 0;
    }

    .dropdown button:hover {
        background-color: #f5f5f5;
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        margin: 20px 0;
    }

    .empty-state p {
        color: #666;
        margin-bottom: 20px;
        font-size: 16px;
    }

    .btn-criar-principal {
        background-color: #007bff;
        color: white;
        font-size: 16px;
        padding: 12px 24px;
    }

    /* Seletor de Revisões (Quadradinhos) */
    .revisoes-selector {
        display: flex;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
    }

    .revisao-quadrado {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background-color: #f8f9fa;
        border: 2px solid #dee2e6;
        border-radius: 8px;
        cursor: pointer;
        padding: 8px;
        transition: all 0.2s;
    }

    .revisao-quadrado:hover {
        border-color: #007bff;
        background-color: #e7f3ff;
        transform: translateY(-2px);
    }

    .revisao-quadrado.ativo {
        background-color: #007bff;
        border-color: #0056b3;
        color: white;
    }

    .versao {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 4px;
    }

    .data-pequena {
        font-size: 11px;
        opacity: 0.8;
        text-align: center;
    }

    /* Detalhes da Revisão */
    .revisao-detalhes {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 25px;
        margin-top: 20px;
    }

    .revisao-header-card {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 2px solid #eee;
    }

    .revisao-header-card h2 {
        margin: 0 0 8px 0;
        color: #333;
    }

    .data {
        color: #666;
        font-size: 14px;
    }

    .revisao-acoes {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .valor-total {
        font-size: 22px;
        font-weight: 700;
        color: #28a745;
    }

    .btn-danger-small {
        background-color: #dc3545;
        font-size: 12px;
        padding: 6px 12px;
    }

    .itens-lista h3 {
        margin: 0 0 20px 0;
        color: #333;
        font-size: 18px;
    }

    .itens-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .item-resumo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 6px;
        border-left: 4px solid #007bff;
    }

    .item-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .itens-select {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .itens-select select {
        margin: 2.5px;
        width: fit-content;
    }

    .item-nome {
        font-weight: 600;
        color: #333;
        font-size: 15px;
    }

    .item-detalhes {
        color: #666;
        font-size: 13px;
    }

    .item-total {
        font-weight: 700;
        color: #28a745;
        font-size: 16px;
    }

    /* Formulário de Nova Revisão */
    .form-revisao {
        background-color: #f0f8ff;
        border: 2px solid #007bff;
    }

    .form-revisao h3 {
        margin-top: 0;
        color: #007bff;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
    }

    .itens-section {
        margin-top: 30px;
    }

    .itens-header {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }

    @media (max-width: 400px){
        .itens-header{
            justify-content: center;
        }
    }

    .itens-header h4 {
        margin: 0;
    }

    .btn-adicionar {
        background-color: #28a745;
        font-size: 13px;
        padding: 6px 12px;
    }

    .item-card {
        background: white;
        padding: 15px;
        border-radius: 6px;
        margin-bottom: 10px;
        border: 1px solid #ddd;
    }

    .item-grid {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 10px;
        margin-bottom: 10px;
    }

    .btn-remover {
        background-color: #dc3545;
        font-size: 12px;
        padding: 6px 12px;
        width: fit-content;
    }

    .form-acoes {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ddd;
    }

    .btn-salvar {
        background-color: #28a745;
    }

    .btn-cancelar {
        background-color: #6c757d;
    }
</style>