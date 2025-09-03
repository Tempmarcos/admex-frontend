import { BASE_URL } from "../../../routes/api";
import { tokenLogin } from "../login";

export async function updatePermissions(permissions : string[], userId: string, isAdmin: boolean) {
		try {
            let tokenValue;
                tokenLogin.subscribe((value) => {
                tokenValue = value;
                });
			const dadosParaEnvio = {
				userId: userId,
				permissoes: permissions,
				isAdmin: isAdmin
			};

			const response = await fetch(BASE_URL + 'users/permissoes/' + userId, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokenValue}`,
				},
				body: JSON.stringify(dadosParaEnvio)
			});

			if (response.ok) {
				const resultado = await response.json();
				console.log(resultado)
				return 'Permissões atualizadas com sucesso!';
				
			} else {
				throw new Error('Erro ao atualizar permissões');
			}
		} catch (error) {
			console.error('Erro:', error);
			return 'Erro ao salvar permissões. Tente novamente.';
		}
	}