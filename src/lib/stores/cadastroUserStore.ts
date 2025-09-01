import { writable } from "svelte/store";

type Mensagem = {
  mensagem: string,
  cor: string,
}

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

export const confirmar_senha = writable<string>();

export const mensagemEmail = writable<Mensagem>();

export const emailConfirmacaoErro = writable<string>();

export const senhaInputErro = writable<string>();

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