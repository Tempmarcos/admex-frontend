export async function fetchCodigoPostal(codigoPostal: string) {
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