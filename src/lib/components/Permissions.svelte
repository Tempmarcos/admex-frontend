<script lang="ts">
    import { updatePermissions } from "$lib/utils/user/updatePermissions";
    import { writable } from "svelte/store";

    let { userPermissions, userId, isAdmin = false } = $props();

    let permissions = writable([
        {nome: "Ver lista de usuários", permissao: 'verUsuarios', valor: false},
        {nome: "Criar usuários", permissao: 'criarUsuarios', valor: false},
        {nome: "Editar usuários", permissao: 'editarUsuarios', valor: false},
        {nome: "Deletar usuários", permissao: 'deletarUsuarios', valor: false},
        {nome: "Ver informações de usuários", permissao: 'verInfoUsuario', valor: false},
        {nome: "Ver dados da empresa", permissao: 'verDados', valor: false},
        {nome: "Editar dados da empresa", permissao: 'editarDados', valor: false},
        {nome: "Ver itens da empresa", permissao: 'verItens', valor: false},
        {nome: "Adicionar itens da empresa", permissao: 'adicionarItens', valor: false},
        {nome: "Editar itens da empresa", permissao: 'editarItens', valor: false},
        {nome: "Deletar itens da empresa", permissao: 'deletarItens', valor: false},
        {nome: "Ver relações da empresa", permissao: 'verEntidades', valor: false},
        {nome: "Adicionar relações da empresa", permissao: 'adicionarEntidades', valor: false},
        {nome: "Editar relações da empresa", permissao: 'editarEntidades', valor: false},
        {nome: "Deletar relações da empresa", permissao: 'deletarEntidades', valor: false},
        {nome: "Criar tarefas", permissao: 'criarTarefas', valor: false},
        {nome: "Ver propostas", permissao: 'verPropostas', valor: false},
        {nome: "Criar propostas", permissao: 'criarPropostas', valor: false},
        {nome: "Deletar propostas", permissao: 'deletarPropostas', valor: false},
    ].map(p => ({
        ...p,
        valor: userPermissions.includes(p.permissao)
    }))
);

    let adminStatus = writable(isAdmin);
    let loading = writable(false);
    let message = writable('');

   async function handleUpdatePermissions(){
	$loading = true;
        const permissoesSelecionadas = $permissions
				.filter(p => p.valor)
				.map(p => p.permissao);
        $message = await updatePermissions(permissoesSelecionadas, userId, $adminStatus);
	$loading = false;
   }

    function toggleAll(marcar: boolean) {
		permissions.set($permissions.map(p => ({ ...p, valor: marcar })));
	}
</script>
<div class="permissions-container">
	<h3>Gerenciar Permissões do Usuário</h3>
	
	<!-- Controle de Admin -->
	<div class="admin-control">
		<label>
			<input 
				type="checkbox" 
				bind:checked={$adminStatus}
			>
			<strong>Usuário Administrador</strong>
		</label>
		<small>Administradores têm acesso total ao sistema, <br> essa ação não pode ser desfeita.</small>
	</div>

	<!-- Controles de seleção rápida -->
	<div class="quick-actions">
		<button type="button" onclick={() => toggleAll(true)}>Marcar Todas</button>
		<button type="button" onclick={() => toggleAll(false)}>Desmarcar Todas</button>
	</div>

	<!-- Lista de permissões -->
	<div class="permissions-grid">
		{#each $permissions as permission, i}
			<div class="permission">
				<label>
					<input 
						type="checkbox" 
						id={permission.permissao} 
						bind:checked={$permissions[i].valor}
						disabled={$adminStatus}
					>
					<span class="permission-name">{permission.nome}</span>
				</label>
			</div>
		{/each}
	</div>

	<!-- Mensagem de status -->
	{#if $message}
		<div class="message" class:success={$message.includes('sucesso')} class:error={$message.includes('Erro')}>
			{$message}
		</div>
	{/if}
	<div class="actions">
		<button 
			onclick={handleUpdatePermissions} 
			disabled={$loading}
			class="save-btn"
		>
			{$loading ? 'Salvando...' : 'Salvar Permissões'}
		</button>
	</div>
</div>
<style>
	.permissions-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.1);
	}

	h3 {
		margin-bottom: 20px;
		color: #333;
		border-bottom: 2px solid #eee;
		padding-bottom: 10px;
	}

	.admin-control {
		margin-bottom: 20px;
		padding: 15px;
		background: #f8f9fa;
		border-radius: 6px;
		border-left: 4px solid #007bff;
	}

	.admin-control label {
		display: flex;
		align-items: center;
		font-weight: 500;
		margin-bottom: 5px;
	}

	.admin-control input {
		margin-right: 10px;
	}

	.admin-control small {
		color: #666;
		font-style: italic;
	}

	.quick-actions {
		margin-bottom: 20px;
		display: flex;
		gap: 10px;
	}

	.quick-actions button {
		padding: 8px 16px;
		border: 1px solid #ddd;
		background: #f8f9fa;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.quick-actions button:hover {
		background: #e9ecef;
	}

	.permissions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 10px;
		margin-bottom: 20px;
		max-height: 400px;
		overflow-y: auto;
		border: 1px solid #eee;
		padding: 15px;
		border-radius: 6px;
	}

	.permission {
		padding: 10px;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.permission:hover {
		background: #f8f9fa;
	}

	.permission label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.permission input {
		margin-right: 10px;
		transform: scale(1.1);
	}

	.permission input:disabled {
		opacity: 0.5;
	}

	.permission-name {
		font-size: 14px;
		line-height: 1.4;
	}

	.message {
		padding: 12px;
		border-radius: 4px;
		margin-bottom: 15px;
		font-weight: 500;
	}

	.message.success {
		background: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.actions {
		display: flex;
		gap: 15px;
		justify-content: flex-end;
		padding-top: 20px;
		border-top: 1px solid #eee;
	}

	.save-btn {
		padding: 12px 24px;
		background: #28a745;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.save-btn:hover:not(:disabled) {
		background: #218838;
	}

	.save-btn:disabled {
		background: #6c757d;
		cursor: not-allowed;
	}
</style>