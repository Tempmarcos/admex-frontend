import { dadosCadastro} from "$lib/stores/cadastroStore";
import { get } from "svelte/store";
import { BASE_URL } from "../../../routes/api";
import { login } from "../login";



export async function submitCadastroEmpresa(){
    try{
        dadosCadastro.update((dados) => ({
            ...dados,
            User: {
                ...dados.User,
                perfil: {
                    nomeDeUsuario: get(dadosCadastro).User.nome
                }
            }
        }))
        console.log(get(dadosCadastro))
        const response = await fetch(BASE_URL + 'empresa/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(get(dadosCadastro))
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        console.log("✅ Cadastro realizado com sucesso:", data)

        login(get(dadosCadastro).User.email, get(dadosCadastro).User.senha)

    } catch (error: any){
        console.error("Erro ao cadastrar empresa: ", error.message || error)
        // alert(error.message || "Ocorreu um erro ao cadastrar.")
        throw error;
    }
    
}