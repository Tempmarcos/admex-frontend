<script lang='ts'>
    import { dadosCadastro, mensagemRegistro, natureza_manual, natureza_selecionada } from '$lib/stores/cadastroStore';
    import '$lib/styles/form.css'
    import { checkRegistroExists } from '$lib/utils/empresa/checkRegistroExists';
    import { fetchRegistro } from '$lib/utils/empresa/fetchRegistro';
    import { processarCep } from '$lib/utils/empresa/processarCep';
    import { validateRegistro } from '$lib/utils/empresa/validarRegistro';

   let debounceRegistroTimeout : any = null;
    function handleInputRegistro(){
      clearTimeout(debounceRegistroTimeout);
      debounceRegistroTimeout = setTimeout(() => {
        (async () => {
          const registro = $dadosCadastro.DadosFiscais.registro;
          if (validateRegistro(registro)) {
            const resposta = await checkRegistroExists(registro);
            if (resposta == null) {
                $mensagemRegistro = {"mensagem": "Erro ao verificar CNPJ.", "cor": "orange"};
            } else if (resposta == false) {
                $mensagemRegistro = {"mensagem": "CNPJ já cadastrado", "cor": "red"};
            } else {
                $mensagemRegistro = {"mensagem": "CNPJ disponível!", "cor": "green"};
                const dados = await fetchRegistro(registro);
                $dadosCadastro.DadosFiscais.classificacao = dados.cnae_fiscal;
                $dadosCadastro.DadosGerais.endereco.codigoPostal = dados.cep;
                processarCep(dados.cep);
                $dadosCadastro.DadosGerais.nome = dados.razao_social;
                $dadosCadastro.DadosGerais.nomeFantasia = dados.nome_fantasia;
                $dadosCadastro.DadosGerais.dataDeFundacao = dados.data_inicio_atividade;
                $dadosCadastro.DadosGerais.endereco.numero = dados.numero;
                $dadosCadastro.DadosGerais.endereco.complemento = dados.complemento;
                if([2062, 2135, 2321, 3034, 3999, 2011, 2038].includes(dados.codigo_natureza_juridica)){
                  $natureza_selecionada = dados.codigo_natureza_juridica;
                  $dadosCadastro.DadosFiscais.camposEspecificos.naturezaJuridica = dados.codigo_natureza_juridica;
                }
                else{
                  $natureza_selecionada = "Outro";
                  $natureza_manual = dados.codigo_natureza_juridica
                  $dadosCadastro.DadosFiscais.camposEspecificos.naturezaJuridica = dados.codigo_natureza_juridica
                }
                if (dados.regime_tributario != null) {
                  $dadosCadastro.DadosFiscais.camposEspecificos.regimeTributario = dados.regime_tributario;
                } else if (dados.opcao_pelo_simples) {
                  $dadosCadastro.DadosFiscais.camposEspecificos.regimeTributario = "simples";
                } else if (dados.opcao_pelo_mei) {
                  $dadosCadastro.DadosFiscais.camposEspecificos.regimeTributario = "mei";
                }
              }
          } else {
              $mensagemRegistro = {"mensagem": "Digite um CNPJ válido.", "cor": "gray"};
          }
        })();
      }, 500);
    };

    function trocarNatureza(){
      if($natureza_selecionada === "Outro") $dadosCadastro.DadosFiscais.camposEspecificos.naturezaJuridica = $natureza_manual
      else $dadosCadastro.DadosFiscais.camposEspecificos.naturezaJuridica = $natureza_selecionada
    }
</script>
<div class="container">
  <form>
    <h1>Crie sua empresa</h1>
    <label for="registro">CNPJ</label>
    <input
    type="number"
    name="registro"
    id="registro"
    maxlength="14"
    minlength="14"
    required
    bind:value={$dadosCadastro.DadosFiscais.registro}
    oninput={handleInputRegistro}
    />
    {#if $mensagemRegistro}
      <p id="registro-status" style="margin-block: 0; color: {$mensagemRegistro.cor}">{$mensagemRegistro.mensagem}</p>
    {/if}
    <label for="nomeEmpresa">Razão Social</label>
    <input type="text" name="nomeEmpresa" id="nomeEmpresa" bind:value={$dadosCadastro.DadosGerais.nome} required />
    <label for="nomeFantasia">Nome fantasia</label>
    <input type="text" name="nomeFantasia" id="nomeFantasia" bind:value={$dadosCadastro.DadosGerais.nomeFantasia} required />
    <label for="dataFundacao">Data de fundação</label>
    <input type="date" name="dataFundacao" id="dataFundacao" bind:value={$dadosCadastro.DadosGerais.dataDeFundacao} required />
    <label for="cnae">CNAE</label>
    <input type="text" name="cnae" id="cnae" bind:value={$dadosCadastro.DadosFiscais.classificacao}/>
    <label for="naturezaJuridica">Natureza Jurídica</label>
    <select
    name="naturezaJuridica"
    id="naturezaJuridica"
    onchange={trocarNatureza}
    bind:value={$natureza_selecionada}
    >
    <option value="">Selecione</option>
    <option value="2062">[206-2] Sociedade Empresária Limitada</option>
    <option value="2135"
        >[213-5] Empresa Individual de Responsabilidade Limitada (EIRELI)</option
    >
    <option value="2321">[232-1] Sociedade Simples Limitada</option>
    <option value="3034">[303-4] Associação Privada</option>
    <option value="3999"
        >[399-9] Outras Entidades Sem Fins Lucrativos</option
    >
    <option value="2011">[201-1] Empresa Pública</option>
    <option value="2038">[203-8] Sociedade de Economia Mista</option>
    <option value="Outro">Outro (digite o código manualmente)</option>
    </select>
    {#if $natureza_selecionada === 'Outro'}
      <div id="codigoManualWrapper" style="margin-top:10px;">
      <label for="codigoManual">Código da Natureza Jurídica:</label>
      <input
          type="text"
          id="codigoManual"
          name="codigoManual"
          placeholder="Ex: 2222"
          onchange={trocarNatureza}
          bind:value={$natureza_manual}
      />
      </div>
    {/if}
    <label for="regime">Regime Tributário</label>
    <select id="regime" name="regime" bind:value={$dadosCadastro.DadosFiscais.camposEspecificos.regimeTributario} required>
    <option value="">Selecione</option>
    <option value="mei">MEI - Microempreendedor Individual</option>
    <option value="simples">Simples Nacional</option>
    <option value="presumido">Lucro Presumido</option>
    <option value="real">Lucro Real</option>
    </select>
    </form>
</div>