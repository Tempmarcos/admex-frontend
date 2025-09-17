import { BASE_URL } from "../../../routes/api"
import { tokenLogin } from "../login"

type DadosGerais = {
    endereco: {
        pais: string,
        dados: {
            cidade: string,
            estado: string,
            numero: string,
            logradouro: string,
            complemento: string,
            codigoPostal: string
        }
    },
    logo: any,
    nome: string,
    nomeFantasia: string
}

export async function updateDadosGerais(dadosGerais : DadosGerais){
    try{
        let tokenValue;
                tokenLogin.subscribe((value) => {
                tokenValue = value;
                });
        console.log(dadosGerais)
        const response = await fetch(BASE_URL + 'empresa/dados-gerais', {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenValue}`,
            },
            body: JSON.stringify(dadosGerais)
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        console.log("✅ Alteração feita com sucesso:", data)

    } catch (error: any){
        throw new Error("Erro ao alterar dados gerais: ", error.message || error)
        // alert(error.message || "Ocorreu um erro ao cadastrar.")
    }
    
}