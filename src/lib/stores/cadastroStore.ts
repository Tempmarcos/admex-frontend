import type { Cidade } from '$lib/types/cidade';
import { writable } from 'svelte/store';

type Estado = {
  id: string,
  sigla: string,
  nome: string,
  regiao: {
    id: string,
    sigla: string,
    nome: string
  }
}

type Mensagem = {
  mensagem: string,
  cor: string,
}
export const estados = writable<Estado[]>([]);

export const cidades = writable<Cidade[]>([]);

export const cepInputErro = writable<string>();

export const confirmar_senha = writable<string>();

export const mensagemEmail = writable<Mensagem>();

export const mensagemRegistro = writable<Mensagem>();

export const senhaInputErro = writable<string>();

export const registroInputErro = writable<string>();


export const dadosCadastro = writable({
  nome: '',
  email: '',
  senha: '',
  registro: '',
  razao_social: '',
  nome_fantasia: '',
  data_fundacao: '',
  cnae: '',
  natureza_juridica: '',
  natureza_selecionada: '',
  natureza_manual: '',
  regime_tributario: '',
  endereco: {
    codigo_postal: '',
    estado: '',
    cidade: '',
    logradouro: '',
    numero: '',
    complemento: ''
  }
});