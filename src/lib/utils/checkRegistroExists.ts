import { BASE_URL } from "../../routes/api";

export async function checkRegistroExists(registro: string) {
      const data = JSON.stringify({
        registro: registro,
      });
      let response;
      try{
        response = await fetch(BASE_URL + `empresa/testar-registro`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        })
    }catch(error){
        console.error("Erro:", error);
        return null;
    }
      const dados = await response!.json();
      if (dados === false) {
        return false;
      } else {
        return true;
      }
    }