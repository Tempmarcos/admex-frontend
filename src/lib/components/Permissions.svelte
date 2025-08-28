<script lang="ts">
    let { userPermissions } = $props();
    let permissions = [
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
</script>
{#each permissions as permission, i}
    <div class="permission">
        <p>{permission.nome}</p>
        <input type="checkbox" id={permission.permissao} value={permission.valor} 
        bind:checked={permissions[i].valor}>
    </div>
{/each}
<style>
    .permission{
        display: flex;
        background-color: gray;
        width: 140px;
        justify-content: space-between;
        padding-inline: 5px;
        margin-top: 5px;
        margin-left: 5px;
        border-radius: 15px;
    }
</style>