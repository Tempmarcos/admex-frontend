import { cepInputErro, dadosCadastro } from "$lib/stores/cadastroStore";
import { fetchCodigoPostal } from "./fetchCodigoPostal";
import { fetchCidades } from "./fetchCidades";

export async function processarCep(codigo_postal: string) {
    const cep = codigo_postal.toString()
    if (cep.length === 8) {
    const resposta = await fetchCodigoPostal(cep);
    cepInputErro.set("");;
    if (resposta) {
        dadosCadastro.update((dados) => ({
            ...dados,
            endereco: {
                ...dados.endereco,
                logradouro: resposta.street,
                estado: resposta.state,
                cidade: resposta.city
            }
        }))

        await fetchCidades(resposta.state);
    }
    } else {
    cepInputErro.set("Digite um CEP válido.");
    }
}