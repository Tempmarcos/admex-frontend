import { writable } from 'svelte/store';

export const estados = writable([]);

export const cidades = writable([]);

export const dadosCadastro = writable({
  nome: '',
  email: '',
  senha: '',
  cnpj: '',
  razao_social: '',
  nome_fantasia: '',
  data_fundacao: '',
  cnae: '',
  natureza_juridica: '',
  regime_tributario: '',
  endereco: {
    cep: '',
    estado: '',
    cidade: '',
    logradouro: '',
    numero: '',
    complemento: ''
  }
});