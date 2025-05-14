<script lang="ts">
  // @ts-nocheck
  import Card from "$lib/components/Card.svelte";
  import InfoCard from "$lib/components/InfoCard.svelte";
  import { onMount } from "svelte";
  import { BASE_URL } from "../api";

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
          const email = emailInput.value.trim();

          if (validateEmail(email)) {
            checkEmailExists(email);
          } else {
            emailStatus.textContent = "Digite um e-mail válido.";
            emailStatus.style.color = "gray";
          }
        }, 500);
      });

      function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }

      async function checkEmailExists(email) {
        const data = JSON.stringify({
          email: email,
        });

        const response = await fetch(BASE_URL + `users/testar-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }).catch((error) => {
          emailStatus.textContent = "Erro ao verificar e-mail.";
          emailStatus.style.color = "orange";
          console.error("Erro:", error);
        });
        const dados = await response.json();
        if (dados === false) {
          console.log(dados);
          emailStatus.textContent = "E-mail já cadastrado.";
          emailStatus.style.color = "red";
        } else {
          console.log(dados);
          emailStatus.textContent = "E-mail disponível!";
          emailStatus.style.color = "green";
        }
      }
    } catch (error) {
      console.log(error);
    }
  });
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
          <!-- Criar uma função que verifique o e-mail assim que é utilizado -->
          <label for="senha">Senha</label>
          <input type="password" name="senha" minlength="6" />
          <label for="confirmarSenha">Confirmar senha</label>
          <input type="password" name="confirmarSenha" minlength="6" />
          <button type="button" onclick={() => nextParte(1)}>Próximo</button>
        </div>
        <div id="parte2" style="display: none;">
          <h1>Crie sua empresa</h1>
          <label for="nomeEmpresa">Nome</label>
          <input type="text" name="nomeEmpresa" />
          <label for="nomeFantasia">Nome fantasia</label>
          <input type="text" name="nomeFantasia" />
          <label for="dataFundacao">Data de fundação</label>
          <input type="date" name="dataFundacao" />
          <h1>Endereço</h1>
          <label for="cep">CEP</label>
          <input type="number" name="cep" />
          <!-- fazer uma verificação de CEP -->
          <label for="estado">Estado</label>
          <select name="estado" id="estado">
            <option value="RS"></option>
            <!-- fazer uma lista dinâmica com os estados -->
          </select>
          <label for="cidade">Cidade</label>
          <select name="estado" id="cidade">
            <option value="Canoas"></option>
            <!-- fazer uma lista dinâmica com as cidades -->
          </select>
          <label for="logradouro">Logradouro</label>
          <input type="text" name="logradouro" id="" />
          <span>
            <button type="button" onclick={() => previousParte(2)}>
              Voltar
            </button>
            <button type="button" onclick={() => nextParte(2)}>Próximo</button>
          </span>
        </div>
        <div id="parte3" style="display: none;">
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
  form input {
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
