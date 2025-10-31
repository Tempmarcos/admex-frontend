export type ListTarefa = {
    id: string,
    nome: string,
    status: string,
    dataAgendada: any,
    responsavel: {
        id: string,
        nome: string
    },
    criador: {
        id: string,
        nome: string
    }
}