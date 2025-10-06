export interface GetEntidade {
    id: string;
    nome: string;
    contato: {
        nome: string;
        cargo: string;
        email: string;
        telefone: string;
    };
    endereco: {
        pais: string;
        dados: {
            codigoPostal: string;
            estado: string;
            cidade: string;
            logradouro: string;
            numero: string;
            complemento: string;
        }
    };
    dadosFinanceiros?: {
        banco: string;
        agencia: string;
        conta: string;
        pix: string;
    };
    registro: string;
}

export interface CreateEntidade {
    nome: string;
    contato: {
        nome: string;
        cargo: string;
        email: string;
        telefone: string;
    };
    endereco: {
        pais: string;
        codigoPostal: string;
        estado: string;
        cidade: string;
        logradouro: string;
        numero: string;
        complemento: string;
    };
    dadosFinanceiros?: {
        banco: string;
        agencia: string;
        conta: string;
        pix: string;
    };
    registro: string;
}