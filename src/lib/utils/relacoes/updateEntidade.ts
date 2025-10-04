import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function updateEntidade(tipo: string, id: string, entidade: any) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      const data = JSON.stringify(entidade)
      const response = await fetch(BASE_URL + "entidade/" + tipo + '/' + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
        body: data
      });
      if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
      }
      const dados = await response.json();
      return dados;
    } catch (error) {
      console.log(error);
    }
  }