import { goto } from "$app/navigation";
import { localStorageStore } from "$lib/stores/localStorageStore";
import { BASE_URL } from "../../routes/api";

export const usuarioLogado = localStorageStore<{
    nome: string;
    id: string;
    email: string;
    permissoes: string[];
    created_at: string;
    updatedAt: string;
    perfil: object;
  }>("usuarioLogado", {
    id: "",
    nome: "",
    email: "",
    permissoes: [],
    created_at: "",
    updatedAt: "",
    perfil: {},
  });

  export const tokenLogin = localStorageStore<string>("tokenLogin", "");
 

  export async function login(email : string, senha: string) {
    const data = JSON.stringify({email, senha})

    try {
      const response = await fetch(BASE_URL + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      const dados = await response.json();
      const user = dados.loginResponse;
      usuarioLogado.set({
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        permissoes: user.permissoes,
        created_at: user.created_at,
        updatedAt: user.updatedAt,
      });

      tokenLogin.set(user.token);
      console.log("Dados recebidos:", dados);
      await goto("/inicio");
    } catch (error) {
      console.error("Erro ao buscar dados: ", error);
    }
  }