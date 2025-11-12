import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function getProposta(id: string) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "proposta" + "/" + id ,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      });
      if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
      }
      const dados = await response.json();
      console.log(dados)
      return await dados;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }