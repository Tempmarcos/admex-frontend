 interface IGetEmpresa { 
    DadosFinanceiros: {
      contaBancaria: string
  },
    DadosFiscais: {
      camposEspecificos: any,
      classificacao: string,
      registro: string
    },
    DadosGerais: {
      dataDeFundacao: any
      endereco: any,
      logo: any,
      nome: string,
      nomeFantasia: string
    },
    dataCadastro: string,
    usuarios: [{id: string, nome:string}]
};