<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import { page } from "$app/state";
  import { getUser } from "$lib/utils/user/getUser";
  import { onMount } from "svelte";
  import { hasPermission } from "$lib/utils/user/hasPermission";
  import Permissions from "$lib/components/Permissions.svelte";
  import { deleteUser } from "$lib/utils/user/deleteUser";
  
  $: id = page.params.id
  let data : any = null;
  onMount(async () => {
    data = await getUser(id)
    console.log(data)
  })

  let tela = 'geral';
  async function handleSwitchTela(tipoTela: string){
    tela = tipoTela;
  }
</script>

<svelte:head>
  <title>Página Inicial</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <Card>
    <div class="content"> 
      <button onclick={() => handleSwitchTela("geral")} disabled={tela == 'geral'}>Geral</button>
      <button onclick={() => handleSwitchTela("permissoes")} disabled={tela == 'permissoes'}>Permissões</button>
      {#if tela == 'geral'}
        <p>{data?.nome}</p>
        <p>{data?.email}</p>
        <button>Alterar senha</button>
        <p>Perfil:</p>
        <p>{data?.perfil.nomeDeUsuario}</p>
        <p>{data?.created_at}</p>
        {#if hasPermission('deletarUsuarios')}
          <button class="delete" onclick={() => deleteUser(data?.id)}>Deletar usuário</button>
        {/if}
      {/if}
      {#if tela == 'permissoes'}
        <Permissions userPermissions={data?.permissoes} userId={data?.id} isAdmin={data?.admin}></Permissions>
      {/if}
    </div>
  </Card>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
    min-height: 100vh;
    background-color: #d9d9d9;
  }
  .content {
    /* max-width: 50vw; */
    display: flex;
    flex-flow: column;
  }
  .content button {
		padding: 8px 16px;
		border: 1px solid #ddd;
		background: #f8f9fa;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

  .content .delete {
    background: #c74433;
  }
  .content .delete:hover {
    background: #9e3628;
  }

	.content button:hover {
		background: #e9ecef;
	}
  
</style>
