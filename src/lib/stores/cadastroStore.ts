import type { Cidade } from '$lib/types/cidade';
import { derived, writable } from 'svelte/store';

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

interface Endereco {
  pais: string;
  codigoPostal: string;
  estado: string;
  cidade: string;
  logradouro: string;
  numero: string;
  complemento: string;
}


interface DadosGerais {
  nome: string;
  nomeFantasia: string;
  dataDeFundacao: string;
  endereco: Endereco;
}

interface DadosFiscais {
  registro: string;
  classificacao: string;
  camposEspecificos: {
    naturezaJuridica: string;
    regimeTributario: string;
  }
}

interface DadosFinanceiros {
  contaBancaria: string;
}

interface User {
  nome: string;
  email: string;
  senha: string;
  perfil :{
    nomeDeUsuario: string;
  }
}

interface DadosCadastroType {
  DadosGerais: DadosGerais;
  DadosFiscais: DadosFiscais;
  DadosFinanceiros: DadosFinanceiros;
  User: User;
  codigo: string;
}
export const estados = writable<Estado[]>([]);

export const cidades = writable<Cidade[]>([]);

export const cepInputErro = writable<string>();

export const confirmar_senha = writable<string>();

export const mensagemEmail = writable<Mensagem>();

export const mensagemRegistro = writable<Mensagem>();

export const senhaInputErro = writable<string>();

export const registroInputErro = writable<string>();

export const emailConfirmacaoErro = writable<string>();

export const timerConfirmacaoEmail = writable(0);

export const natureza_selecionada = writable<string>();

export const natureza_manual = writable<string>();

export const dadosCadastro = writable<DadosCadastroType>({
  DadosGerais: {
    nome: '',
    nomeFantasia: '',
    dataDeFundacao: '',
    endereco: {
      pais: 'BR',
      codigoPostal: '',
      estado: '',
      cidade: '',
      logradouro: '',
      numero: '',
      complemento: ''
    }
  },
  DadosFiscais: {
    registro: '',
    classificacao: '',
    camposEspecificos: {
      naturezaJuridica: '',
      regimeTributario: ''
    }
  },
  DadosFinanceiros: {
    contaBancaria: ''
  },
  User: {
    nome: '',
    email: '',
    senha: '',
    perfil: {
      nomeDeUsuario: '',
    }
  },
  codigo: ''
});


interface ValidacaoCadastro {
  dadosGerais: boolean;
  dadosFiscais: boolean;
  user: boolean;
  codigo: boolean;
  completo: boolean;
}
// Store derivado alternativo - mais flexível, retorna objeto com detalhes
export const validacaoCadastro = derived(
  [dadosCadastro, confirmar_senha],
  ([$dados, $confirmar_senha]): ValidacaoCadastro => {
    const temValor = (valor: any) => 
      typeof valor === 'string' ? valor.trim() !== '' : valor != null;
    
    const dadosGerais = 
      temValor($dados.DadosGerais.nome) &&
      temValor($dados.DadosGerais.nomeFantasia) &&
      temValor($dados.DadosGerais.dataDeFundacao) &&
      temValor($dados.DadosGerais.endereco.codigoPostal) &&
      temValor($dados.DadosGerais.endereco.estado) &&
      temValor($dados.DadosGerais.endereco.cidade) &&
      temValor($dados.DadosGerais.endereco.logradouro) &&
      temValor($dados.DadosGerais.endereco.numero);
    
    const dadosFiscais = 
      temValor($dados.DadosFiscais.registro) &&
      temValor($dados.DadosFiscais.classificacao) &&
      temValor($dados.DadosFiscais.camposEspecificos.naturezaJuridica) &&
      temValor($dados.DadosFiscais.camposEspecificos.regimeTributario);
    

    const user = 
      temValor($dados.User.nome) &&
      temValor($dados.User.email) &&
      temValor($dados.User.senha) &&
      $dados.User.senha === $confirmar_senha;
    
    const codigo = temValor($dados.codigo);
    
    return {
      dadosGerais,
      dadosFiscais,
      user,
      codigo,
      completo: dadosGerais && dadosFiscais && user && codigo
    };
  }
);

export const tipoRelacao = writable<string>('');
