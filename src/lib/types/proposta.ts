export type ListProposta = {
    id: string;
    codigo: string;
    status: string;
    cliente: {
        nome: string;
    }
}

export type GetProposta = {
    id: string;
    codigo: string;
    status: string;
    cliente: {
        nome: string
    }
    descricao: string;
    tituloProjeto: string;
    endereco: string;
    createdAt: string;
    updatedAt: string;
    revisoes: revisao[];
}

export type revisao = {                      
    id: string;
    dataProposta: string;
    valorTotal: string;
    numeroRevisao: string;
    createdAt: string;
    aprovado: boolean;
    executado: boolean;
    itens: ItemProposta[];
}

export type ItemProposta = {
    id: string;
    nome: string;
    preco: string;
    quantidade: any;
    unidadeDeMedida: string;
}

export type UpdateProposta = {
    descricao: string;
    status: string;
    tituloProjeto: string;
    endereco: string;
}

export type CreateRevisao = {
    propostaId: string;
    dataProposta: string;
    valorTotal: any;
    itens: Omit<ItemProposta, 'id'>[]
}

export type UpdateRevisao = {

}