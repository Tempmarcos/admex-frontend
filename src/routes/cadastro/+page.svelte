<script lang="ts">
  // @ts-nocheck
  import Card from "$lib/components/Card.svelte";
  import InfoCard from "$lib/components/InfoCard.svelte";
  import { onMount } from "svelte";
  import { BASE_URL } from "../api";
  import { validateRegistro } from "$lib/utils/validarRegistro";
  import { validateEmail } from "$lib/utils/validarEmail";
  import { checkRegistroExists } from "$lib/utils/checkRegistroExists";
  import { checkEmailExists } from "$lib/utils/checkEmailExists";

  let estados = [];
  let cidades = [];

  async function fetchEstadosBrasileiros() {
    try {
      const resposta = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      if (!resposta.ok) {
        const texto = await resposta.text();
        console.error("Erro na resposta da API:", resposta.status, texto);
        return;
      }
      const data = await resposta.json();
      estados = data.sort((a, b) => a.nome.localeCompare(b.nome));
      // console.log(estados);
    } catch (error) {
      throw error;
    }
  }
  fetchEstadosBrasileiros();

  async function carregarCidades(event) {
    let sigla;
    try {
      sigla = event.target.value;
    } catch {
      sigla = event;
    }
    const estado = estados.find((e) => e.sigla === sigla);
    console.log(estado);
    try {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado.id}/municipios`
      );
      const data = await res.json();
      cidades = data.sort((a, b) => a.nome.localeCompare(b.nome));
      console.log(cidades);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // console.log(email, password);
    const data = JSON.stringify({
      email: email,
      senha: password,
    });
    // console.log(data);
    login(data);
  };

  const nextParte = (number) => {
    try {
      const parteAtual = document.getElementById("parte" + number);
      parteAtual.style.display = "none";
      const proximaParte = document.getElementById("parte" + (number + 1));
      proximaParte.style.display = "flex";
    } catch (error) {
      console.log(error);
    }
  };

  const previousParte = (number) => {
    try {
      const parteAtual = document.getElementById("parte" + number);
      parteAtual.style.display = "none";
      const proximaParte = document.getElementById("parte" + (number - 1));
      proximaParte.style.display = "flex";
    } catch (error) {
      console.log(error);
    }
  };
  onMount(() => {
    try {
      const emailInput = document.getElementById("email");
      const emailStatus = document.getElementById("email-status");

      let debounceTimeout = null;

      emailInput.addEventListener("input", () => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
          (async () => {
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
              const resposta = await checkEmailExists(email);
              if (resposta == null) {
                emailStatus.textContent = "Erro ao verificar e-mail.";
                emailStatus.style.color = "orange";
              } else if (resposta === false) {
                emailStatus.textContent = "E-mail já cadastrado.";
                emailStatus.style.color = "red";
              } else {
                emailStatus.textContent = "E-mail disponível!";
                emailStatus.style.color = "green";
              }
            } else {
              emailStatus.textContent = "Digite um e-mail válido.";
              emailStatus.style.color = "gray";
            }
          })();
        }, 500);
      });
    } catch (error) {
      console.log(error);
    }

    //VERIFICAÇÃO DE CNPJ
    const registroInput = document.getElementById("registro");
    const registroStatus = document.getElementById("registro-status");
    const naturezaInput = document.getElementById("naturezaJuridica");
    const cnaeInput = document.getElementById("cnae");
    const regimeInput = document.getElementById("regime");
    const codigoPostalInput = document.getElementById("cep");
    const numeroInput = document.getElementById("numero");
    const complementoInput = document.getElementById("complemento");
    const nomeEmpresaInput = document.getElementById("nomeEmpresa");
    const nomeFantasiaInput = document.getElementById("nomeFantasia");
    const dataFundacaoInput = document.getElementById("dataFundacao");
    const cidadeInput = document.getElementById("cidade");
    const estadoInput = document.getElementById("estado");
    const logradouroInput = document.getElementById("logradouro");

    let debounceRegistroTimeout = null;

    registroInput.addEventListener("input", () => {
      clearTimeout(debounceRegistroTimeout);

      debounceRegistroTimeout = setTimeout(() => {
        (async () => {
          const registro = registroInput.value.trim();

          if (validateRegistro(registro)) {
            const resposta = await checkRegistroExists(registro);
            if (resposta == null) {
              registroStatus.textContent = "Erro ao verificar CNPJ.";
              registroStatus.style.color = "orange";
            } else if (resposta == false) {
              registroStatus.textContent = "CNPJ já cadastrado.";
              registroStatus.style.color = "red";
            } else {
              registroStatus.textContent = "CNPJ disponível!";
              registroStatus.style.color = "green";
              const dados = await fetchRegistro(registro);
              cnaeInput.value = dados.cnae_fiscal;
              codigoPostalInput.value = dados.cep;
              processarCep();
              nomeEmpresaInput.value = dados.razao_social;
              nomeFantasiaInput.value = dados.nome_fantasia;
              dataFundacaoInput.value = dados.data_inicio_atividade;
              numeroInput.value = dados.numero;
              complementoInput.value = dados.complemento;
              //RESTO DOS DADOS
              try {
                naturezaInput.value = dados.codigo_natureza_juridica;
              } catch (error) {
                const input = document.getElementById("codigoManual");
                naturezaInput.value = "Outro";
                input.value = dados.codigo_natureza_juridica;
              }
              if (dados.regime_tributario != null) {
                regimeInput.value = dados.regime_tributario;
              } else if (dados.opcao_pelo_simples) {
                regimeInput.value = "simples";
              } else if (dados.opcao_pelo_mei) {
                regimeInput.value = "mei";
              }
            }
          } else {
            registroStatus.textContent = "Digite um CNPJ válido.";
            registroStatus.style.color = "gray";
          }
        })();
      }, 500);
    });

    async function fetchRegistro(registro: string) {
      const cnpj = registro;

      const response = await fetch(
        `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((error) => {
        console.error("Erro:", error);
        return null;
      });
      const dados = await response!.json();
      console.log(dados);
      return dados;
    }

    //PUXAR DADOS DO CEP
    const codigoPostalStatus = document.getElementById("cep-status");

    let debounceCodigoPostalTimeout = null;

    async function processarCep() {
      const codigoPostal: string = codigoPostalInput.value.trim();
      if (codigoPostal.length === 8) {
        const resposta = await fetchCodigoPostal(codigoPostal);
        codigoPostalStatus.textContent = "";
        if (resposta) {
          logradouroInput.value = resposta.street;
          estadoInput.value = resposta.state;
          await carregarCidades(resposta.state);
          cidadeInput.value = resposta.city;
        }
      } else {
        codigoPostalStatus.textContent = "Digite um CEP válido.";
        codigoPostalStatus.style.color = "gray";
      }
    }

    codigoPostalInput.addEventListener("input", () => {
      clearTimeout(debounceCodigoPostalTimeout);

      debounceCodigoPostalTimeout = setTimeout(processarCep, 500);
    });

    async function fetchCodigoPostal(codigoPostal: string) {
      const cep = codigoPostal;

      const response = await fetch(
        `https://brasilapi.com.br/api/cep/v1/${cep}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).catch((error) => {
        console.error("Erro:", error);
        return null;
      });
      const dados = await response!.json();
      console.log(dados);
      return dados;
    }
  });

  //LÓGICA NATUREZA JURÍDICA
  function toggleCodigoManual(event) {
    const wrapper = document.getElementById("codigoManualWrapper");
    const input = document.getElementById("codigoManual");

    console.log(event.target.value);
    if (event.target.value === "Outro") {
      wrapper.style.display = "flex";
      input.required = true;
    } else {
      wrapper.style.display = "none";
      input.required = false;
      input.value = "";
    }
  }
</script>

<main>
  <h1 class="sair"><a href="/">Voltar</a></h1>
  <h1 class="title">Começe a criar sua conta</h1>
  <Card>
    <div class="container">
      <form onsubmit={handleSubmit} name="cadastro">
        <div id="parte1">
          <h1>Crie seu usuário admin</h1>
          <label for="nome">Nome</label>
          <input type="text" name="nome" required />
          <label for="email">Email</label>
          <input type="email" name="email" required id="email" />
          <p id="email-status" style="margin-block: 0;"></p>
          <label for="senha">Senha</label>
          <input type="password" name="senha" minlength="6" required />
          <label for="confirmarSenha">Confirmar senha</label>
          <input type="password" name="confirmarSenha" minlength="6" required />
          <!-- Criar uma função para verificar se as senhas são iguais -->
          <button type="button" onclick={() => nextParte(1)}>Próximo</button>
        </div>
        <div id="parte2" style="display: none;">
          <h1>Crie sua empresa</h1>
          <label for="registro">CNPJ</label>
          <input
            type="number"
            name="registro"
            id="registro"
            maxlength="14"
            minlength="14"
            required
          />
          <p id="registro-status" style="margin-block: 0;"></p>
          <label for="nomeEmpresa">Razão Social</label>
          <input type="text" name="nomeEmpresa" id="nomeEmpresa" required />
          <label for="nomeFantasia">Nome fantasia</label>
          <input type="text" name="nomeFantasia" id="nomeFantasia" required />
          <label for="dataFundacao">Data de fundação</label>
          <input type="date" name="dataFundacao" id="dataFundacao" required />
          <label for="cnae">CNAE</label>
          <input type="text" name="cnae" id="cnae" />
          <label for="naturezaJuridica">Natureza Jurídica</label>
          <select
            name="naturezaJuridica"
            id="naturezaJuridica"
            onchange={toggleCodigoManual}
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
          <div id="codigoManualWrapper" style="margin-top:10px; display: none;">
            <label for="codigoManual">Código da Natureza Jurídica:</label>
            <input
              type="text"
              id="codigoManual"
              name="codigoManual"
              placeholder="Ex: 2222"
            />
          </div>
          <label for="regime">Regime Tributário</label>
          <select id="regime" name="regime" required>
            <option value="">Selecione</option>
            <option value="mei">MEI - Microempreendedor Individual</option>
            <option value="simples">Simples Nacional</option>
            <option value="presumido">Lucro Presumido</option>
            <option value="real">Lucro Real</option>
          </select>
          <span>
            <button type="button" onclick={() => previousParte(2)}>
              Voltar
            </button>
            <button type="button" onclick={() => nextParte(2)}>Próximo</button>
          </span>
        </div>
        <div id="parte3" style="display: none;">
          <h1>Endereço</h1>
          <label for="cep">CEP</label>
          <input
            type="number"
            name="cep"
            id="cep"
            minlength="8"
            maxlength="8"
            required
          />
          <p id="cep-status" style="margin-block: 0;"></p>
          <label for="estado">Estado</label>
          <select name="estado" id="estado" required onchange={carregarCidades}>
            <option value="">Selecione</option>
            {#each estados as estado}
              <option value={estado.sigla}>{estado.nome}</option>
            {/each}
          </select>
          <label for="cidade">Cidade</label>
          <select name="cidade" id="cidade" required>
            <option value="">Selecione</option>
            {#each cidades as cidade}
              <option value={cidade.nome}>{cidade.nome}</option>
            {/each}
          </select>
          <label for="logradouro">Logradouro</label>
          <input type="text" name="logradouro" id="logradouro" required />
          <label for="numero">Número</label>
          <input type="text" id="numero" name="numero" required />
          <label for="complemento">Complemento</label>
          <input type="text" name="complemento" id="complemento" />
          <span>
            <button type="button" onclick={() => previousParte(3)}>
              Voltar
            </button>
            <button type="submit">Enviar</button>
          </span>
        </div>
      </form>
    </div>
  </Card>
  <script>
  </script>
</main>

<style>
  select {
    padding: 5px;
    max-width: 200px;
  }

  span {
    display: flex;
    justify-content: center;
  }
  button {
    padding: 10px;
    margin: 5px;
    border: none;
    background-color: chartreuse;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: rgb(89, 176, 1);
  }
  main {
    height: 100%;
    height: 100vh;
    width: 100%;
    background-color: #363636;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .container {
    height: 100%;
    width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .container form {
    display: flex;
    flex-flow: column;
    align-items: center;
  }
  form input,
  form select {
    margin-bottom: 10px;
  }
  .title {
    color: white;
    font-size: 3.6rem;
  }
  .sair {
    position: fixed;
    left: 1vw;
    top: 1vh;
  }
  .sair a {
    text-decoration: none;
    color: white;
  }

  form div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    margin-bottom: 10px;
  }
</style>
