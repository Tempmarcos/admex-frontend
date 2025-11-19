import { tokenLogin } from "$lib/utils/login";
import { BASE_URL } from "../../../../routes/api";


export async function updateRevisao(id: string, revisao: any) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      const data = JSON.stringify(revisao)
      console.log(data)
      const response = await fetch(BASE_URL + "proposta/revisao" + "/" + id, {
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
      return await dados;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }