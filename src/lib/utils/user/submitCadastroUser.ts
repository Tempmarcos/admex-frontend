import { get } from "svelte/store";
import { BASE_URL } from "../../../routes/api";
import { login } from "../login";
import { userCadastro } from "$lib/stores/cadastroUserStore";

export async function submitCadastroUser(token: string){
    try{
        userCadastro.update((dados) => ({
            ...dados,
            user: {
                ...dados.user,
                perfil: {
                    nomeDeUsuario: get(userCadastro).user.nome
                }
            }
        }))
        console.log(get(userCadastro))
        const response = await fetch(BASE_URL + 'users/' + token, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(get(userCadastro))
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        console.log("✅ Cadastro realizado com sucesso:", data)

        login(get(userCadastro).user.email, get(userCadastro).user.senha)

    } catch (error: any){
        console.error("Erro ao cadastrar usuário: ", error.message || error)
        // alert(error.message || "Ocorreu um erro ao cadastrar.")
    }
    
}