import { BASE_URL } from "../../../routes/api";

export async function verificarConvite(token: string) {
    try {
      const data= JSON.stringify({ token: token }) 
      const response = await fetch(BASE_URL + "convite/verificar-convite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
      }
      const dados = await response.json();
      console.log(dados)
      return dados;
    } catch (error: any) {
      console.error("Erro ao verificar convite: ", error.message || error)
      return "Tente novamente"
    }
  }