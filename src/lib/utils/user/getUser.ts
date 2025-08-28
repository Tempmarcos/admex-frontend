import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function getUser(id : string) {
    try {
      let tokenValue;
      tokenLogin.subscribe((value) => {
        tokenValue = value;
      });
      // console.log(tokenValue);
      const response = await fetch(BASE_URL + "users/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenValue}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      const dados = await response.json();
      return dados;
    } catch (error) {
      console.log(error);
    }
  }