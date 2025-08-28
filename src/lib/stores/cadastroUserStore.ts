import { writable } from "svelte/store";

interface DadosCadastroType {
  user: {
    nome: string,
    email: string
    senha: string,
    perfil: {
      nomeDeUsuario: string;
    }
  }
  codigo: string;
}

export const userCadastro = writable<DadosCadastroType>({
  user: {
    nome: '',
    email: '',
    senha: '',
    perfil: {
      nomeDeUsuario: '',
    }
  },
  codigo: ''
});