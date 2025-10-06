<script lang='ts'>
    import { goto } from "$app/navigation";
    import { cepInputErro, cidades, estados, tipoRelacao } from "$lib/stores/cadastroStore";
    import { fetchCidades } from "$lib/utils/empresa/fetchCidades";
    import { fetchCodigoPostal } from "$lib/utils/empresa/fetchCodigoPostal";
    import { fetchEstados } from "$lib/utils/empresa/fetchEstados";
    import { createEntidade } from "$lib/utils/relacoes/createEntidade";
    import { onDestroy, onMount } from 'svelte';
    import { writable } from "svelte/store";


    let tipoSelecionado: 'cliente' | 'fornecedor' = 'cliente';
    let loading = false;
    let mensagem = writable('');
    $: erroCep = $cepInputErro;
    let debounceTimeout: number | undefined;

  async function processarCep(codigo_postal: string) {
    const cep = codigo_postal.toString()
    if (cep.length === 8) {
    const resposta = await fetchCodigoPostal(cep);
    cepInputErro.set("");;
    if (resposta) {
        formData.update((dados) => ({
            ...dados,
            endereco: {
                ...dados.endereco,
                    logradouro: resposta.street,
                    estado: resposta.state,
                    cidade: resposta.city
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

    // Dados do formulário
    let formData = writable({
        nome: '',
        registro: '',
        contato: {
            nome: '',
            cargo: '',
            email: '',
            telefone: ''
        },
        endereco: {
            pais: 'BR',
            codigoPostal: '',
            estado: '',
            cidade: '',
            logradouro: '',
            numero: '',
            complemento: ''
        },
        dadosFinanceiros: {
            banco: '',
            agencia: '',
            conta: '',
            pix: ''
        }
    });

    function limparFormulario() {
        $formData = {
            nome: '',
            registro: '',
            contato: {
                nome: '',
                cargo: '',
                email: '',
                telefone: ''
            },
            endereco: {
                pais: 'BR',
                codigoPostal: '',
                estado: '',
                cidade: '',
                logradouro: '',
                numero: '',
                complemento: ''
            },
            dadosFinanceiros: {
                banco: '',
                agencia: '',
                conta: '',
                pix: ''
            }
        };
    }

    $: {
        // Atualiza o store quando o tipo muda
        tipoRelacao.set(tipoSelecionado);
    }

    async function criarEntidade() {
        if (!$formData.nome.trim()) {
            $mensagem = 'Erro: Nome é obrigatório';
            return;
        }

        loading = true;
        $mensagem = '';

        try {
            // Prepara os dados baseado no tipo
            const dadosParaEnviar = {
                nome: $formData.nome,
                registro: $formData.registro,
                contato: $formData.contato,
                endereco: $formData.endereco
            };

            // Adiciona dados específicos do tipo
            if (tipoSelecionado === 'fornecedor') {
                (dadosParaEnviar as any).dadosFinanceiros = $formData.dadosFinanceiros;
            }

            const novaEntidade = await createEntidade(tipoSelecionado, dadosParaEnviar);
            goto(`/relacoes`);
        } catch (err) {
            $mensagem = 'Erro ao criar relação. Tente novamente.';
            console.error(err);
        } finally {
            loading = false;
        }
    }

    function cancelar() {
        goto('/relacoes');
    }

    onMount(async () => { 
        await fetchEstados();
    })
</script>

<svelte:head>
  <title>Criar Nova Relação</title>
  <meta name="description" content="Criar nova relação" />
</svelte:head>

<section>
<div class="container">
    <div class="header">
        <h1>Criar Nova Relação</h1>
    </div>
    <form on:submit|preventDefault={criarEntidade}>
        <div class="secao">
            <h2>Tipo de Relação</h2>
            <label>
                Tipo:
                <select bind:value={tipoSelecionado}>
                    <option value="cliente">Cliente</option>
                    <option value="fornecedor">Fornecedor</option>
                </select>
            </label>
        </div>

        <div class="secao">
            <h2>Informações Básicas</h2>
            <label>
                Nome *:
                <input 
                    type="text" 
                    bind:value={$formData.nome}
                    placeholder="Digite o nome da relação"
                    required
                />
            </label>
            <label>
                CPF/CPNJ *:
                <input 
                    type="text" 
                    bind:value={$formData.registro}
                    placeholder="Digite o CPF ou CNPJ"
                    required
                />
            </label>
        </div>

        <div class="secao">
            <h2>Contato</h2>
            <label>
                Nome do Contato:
                <input 
                    type="text" 
                    bind:value={$formData.contato.nome}
                    placeholder="Digite o nome do contato"
                />
            </label>
            
            <label>
                Cargo:
                <input 
                    type="text" 
                    bind:value={$formData.contato.cargo}
                    placeholder="Digite o cargo"
                />
            </label>

            <label>
                E-mail:
                <input 
                    type="email" 
                    bind:value={$formData.contato.email}
                    placeholder="Digite o e-mail"
                />
            </label>

            <label>
                Telefone:
                <input 
                    type="tel" 
                    bind:value={$formData.contato.telefone}
                    placeholder="Digite o telefone"
                />
            </label>
        </div>

        <div class="secao">
            <h2>Endereço</h2>
            <label>
                CEP:
                <input 
                type="number"
                name="cep"
                id="cep"
                minlength="8"
                maxlength="8"
                bind:value={$formData.endereco.codigoPostal}
                placeholder="Digite o CEP"
                on:input={handleCepInput}
                />
            </label>
            {#if erroCep}
                <p id="cep-status" style="margin-block: 0;">{erroCep}</p>
            {/if}
            <label for="estado">
                Estado:
                <select name="estado" id="estado" required on:change={fetchCidades} bind:value={$formData.endereco.estado}>
                <option value="">Selecione</option>
                {#each $estados as estado}
                    <option value={estado.sigla}>{estado.nome}</option>
                {/each}
                </select>
            </label>
            <label for="cidade">
                Cidade:
                <select name="cidade" id="cidade" required bind:value={$formData.endereco.cidade}>
                <option value="">Selecione</option>
                {#each $cidades as cidade}
                    <option value={cidade.nome}>{cidade.nome}</option>
                {/each}
                </select>
            </label>
            <label for="logradouro">
                Logradouro:
                <input type="text" name="logradouro" id="logradouro" required bind:value={$formData.endereco.logradouro}/>
            </label>
            <label for="numero">
                Número:
                <input type="text" id="numero" name="numero" required bind:value={$formData.endereco.numero}/>
            </label>
            <label for="complemento">
                Complemento:
                <input type="text" name="complemento" id="complemento" bind:value={$formData.endereco.complemento}/>
            </label>
        </div>

        {#if tipoSelecionado === 'fornecedor'}
            <div class="secao">
                <h2>Dados Financeiros</h2>
                <label>
                    Banco:
                    <input 
                        type="text" 
                        bind:value={$formData.dadosFinanceiros.banco}
                        placeholder="Digite o nome do banco"
                    />
                </label>

                <label>
                    Agência:
                    <input 
                        type="text" 
                        bind:value={$formData.dadosFinanceiros.agencia}
                        placeholder="Digite o número da agência"
                    />
                </label>

                <label>
                    Conta:
                    <input 
                        type="text" 
                        bind:value={$formData.dadosFinanceiros.conta}
                        placeholder="Digite o número da conta"
                    />
                </label>

                <label>
                    Chave PIX:
                    <input 
                        type="text" 
                        bind:value={$formData.dadosFinanceiros.pix}
                        placeholder="Digite a chave PIX"
                    />
                </label>
            </div>
        {/if}

        <div class="acoes">
            <button type="submit" disabled={loading}>
                {#if loading}
                    Criando...
                {:else}
                    Criar Relação
                {/if}
            </button>
            <button type="button" on:click={limparFormulario} class="secondary">
                Limpar
            </button>
            <button type="button" on:click={cancelar} class="secondary">
                Cancelar
            </button>
        </div>
        {#if $mensagem}
            <div class="message" class:success={$mensagem.includes('sucesso')} class:error={$mensagem.includes('Erro')}>
                {$mensagem}
            </div>
        {/if}
    </form>
</div>
</section>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .header {
        margin-bottom: 30px;
    }

    .secao {
        margin-bottom: 30px;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
    }

    label {
        display: block;
        margin-bottom: 15px;
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

    .acoes {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 30px;
    }

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
    }

    button[type="submit"] {
        background-color: #4CAF50;
        color: white;
    }

    button[type="submit"]:hover:not(:disabled) {
        background-color: #45a049;
    }

    button[type="submit"]:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    button.secondary {
        background-color: #6c757d;
        color: white;
    }

    button.secondary:hover {
        background-color: #5a6268;
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

    h2 {
        color: #333;
        margin-top: 0;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;
    }

    select {
        background-color: white;
        cursor: pointer;
    }
</style>