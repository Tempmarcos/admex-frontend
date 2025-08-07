export type Cidade = {
  id: string,
  microrregiao: {
    id: string,
    mesorregiao: {
      UF: {
        id: string,
        nome: string,
        regiao: {
            id: string,
            nome: string,
            sigla: string
        },
        sigla: string
      },
      id: string,
      nome: string
    }
  },
  nome: string,
  "regiao-imediata": {
    id: string,
    nome: string,
    "regiao-intermediaria": {
      UF: {
        id: string,
        nome: string,
        regiao: {
            id: string,
            nome: string,
            sigla: string
        },
        sigla: string
      },
      id: string,
      nome: string
    }
  }
}