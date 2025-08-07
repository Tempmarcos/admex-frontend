export async function fetchRegistro(registro: string) {
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