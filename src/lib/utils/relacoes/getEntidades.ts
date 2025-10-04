import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function getEntidades(tipo: string) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "entidade/" + tipo, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        }
      });
      if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
      }
      const dados = await response.json();
      return await dados.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    } catch (error) {
      console.log(error);
    }
  }