import { BASE_URL, FRONTEND_LINK } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function gerarLink() {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "convite/gerar-convite", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      const dados = await response.text();
      const link = FRONTEND_LINK + "/cadastro/user" + dados
      return link;
      // console.log(dados);
    } catch (error) {
      console.log(error);
      return "Tente novamente"
    }
  }