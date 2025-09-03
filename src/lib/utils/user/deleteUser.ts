import { BASE_URL } from "../../../routes/api"
import { tokenLogin } from "../login";

export async function deleteUser(id: string){
    try{
        let tokenValue;
              tokenLogin.subscribe((value) => {
                tokenValue = value;
              });
        const response = await fetch(BASE_URL + 'users/' + id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokenValue}`,
            },
        })
        if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            throw new Error(errorData?.error.message || `Erro ${response.status}: ${response.statusText}`)
        }
        const data = await response.json()
        console.log("✅ Usuário deletado com sucesso:", data)

    } catch (error: any){
        console.error("Erro ao deletar usuário: ", error.message || error)
        // alert(error.message || "Ocorreu um erro ao cadastrar.")
    }
    
}