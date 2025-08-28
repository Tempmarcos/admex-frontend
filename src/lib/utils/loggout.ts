import { goto } from "$app/navigation";
import { tokenLogin, usuarioLogado } from "./login";

export function loggout(){
    tokenLogin.set('');
    usuarioLogado.set({
    id: "",
    nome: "",
    email: "",
    permissoes: [],
    created_at: "",
    updatedAt: "",
    perfil: {},
  })

  goto('/')
}