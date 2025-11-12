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
    createdAt: string;
    updatedAt: string;
    revisoes: any
}

export type revisao = {

}

export type UpdateProposta = {
    descricao: string;
    status: string;
}