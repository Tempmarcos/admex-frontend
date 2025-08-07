import { BASE_URL } from "../../routes/api";

export async function checkEmailExists(email: string) {
        const data = JSON.stringify({
          email: email,
        });

        const response = await fetch(BASE_URL + `users/testar-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        }).catch((error) => {
          console.error("Erro:", error);
          return null;
        });
        try{
          const dados = await response?.json();
          if (dados === false) {
            return false;
          } else if (dados === true){
            return true;
          } else {
            return null;
          }
        } catch (e) {
          console.error("Erro ao interpretar JSON:", e);
          return null;
        }
      }