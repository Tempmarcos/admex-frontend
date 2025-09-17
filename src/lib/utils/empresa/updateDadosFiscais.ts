import { BASE_URL } from "../../../routes/api"
import { tokenLogin } from "../login";

type DadosFiscais = {
    camposEspecificos: {
        naturezaJuridica: string,
        regimeTributario: string
    },
    classificacao: string,
    registro: string
}

export async function updateDadosFiscais(dadosFiscais : DadosFiscais){
    try{
        let tokenValue;
        tokenLogin.subscribe((value) => {
        tokenValue = value;
        });
        const bodyData = JSON.stringify(dadosFiscais)
        console.log(bodyData)
        const response = await fetch(BASE_URL + 'empresa/dados-fiscais', {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenValue}`,
            },
            body: JSON.stringify(dadosFiscais)
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        console.log("✅ Alteração feita com sucesso:", data)
    } catch (error: any){
        throw new Error("Erro ao alterar dados fiscais: ", error.message || error)
        // alert(error.message || "Ocorreu um erro ao cadastrar.")
    }
    
}