<script lang="ts">
    import '$lib/styles/form.css'
    import { cepInputErro, cidades, dadosCadastro, estados } from "$lib/stores/cadastroStore";
    import { fetchCidades } from "$lib/utils/empresa/fetchCidades";
    import { processarCep } from "$lib/utils/empresa/processarCep";
    import { onMount } from "svelte";

   $: erroCep = $cepInputErro;

    onMount(async() => {
        const codigoPostalInput = document.getElementById("cep") as HTMLInputElement;
        let debounceCodigoPostalTimeout : any = null;
        codigoPostalInput.addEventListener("input", () => {
        clearTimeout(debounceCodigoPostalTimeout);
        debounceCodigoPostalTimeout = setTimeout(() => processarCep($dadosCadastro.DadosGerais.endereco.codigoPostal), 500);
        });
    })
</script>

<div class="container">
    <form>
        <h1>Endereço</h1>
        <label for="cep">CEP</label>
        <input
        type="number"
        name="cep"
        id="cep"
        minlength="8"
        maxlength="8"
        required
        bind:value={$dadosCadastro.DadosGerais.endereco.codigoPostal}
        />
        {#if erroCep}
            <p id="cep-status" style="margin-block: 0;">{erroCep}</p>
        {/if}
        <label for="estado">Estado</label>
        <select name="estado" id="estado" required onchange={fetchCidades} bind:value={$dadosCadastro.DadosGerais.endereco.estado}>
        <option value="">Selecione</option>
        {#each $estados as estado}
            <option value={estado.sigla}>{estado.nome}</option>
        {/each}
        </select>
        <label for="cidade">Cidade</label>
        <select name="cidade" id="cidade" required bind:value={$dadosCadastro.DadosGerais.endereco.cidade}>
        <option value="">Selecione</option>
        {#each $cidades as cidade}
            <option value={cidade.nome}>{cidade.nome}</option>
        {/each}
        </select>
        <label for="logradouro">Logradouro</label>
        <input type="text" name="logradouro" id="logradouro" required bind:value={$dadosCadastro.DadosGerais.endereco.logradouro}/>
        <label for="numero">Número</label>
        <input type="text" id="numero" name="numero" required bind:value={$dadosCadastro.DadosGerais.endereco.numero}/>
        <label for="complemento">Complemento</label>
        <input type="text" name="complemento" id="complemento" bind:value={$dadosCadastro.DadosGerais.endereco.complemento}/>
    </form>
</div>