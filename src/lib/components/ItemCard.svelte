<script>
    import { hasPermission } from "$lib/utils/user/hasPermission";

  let { nome, onClickGet, onClickDelete } = $props();
</script>

<div class="card">
    <h1>{nome}</h1>
    <button onclick={onClickGet}>+</button>
    {#if hasPermission('deletarItens')}
        <button onclick={onClickDelete}>Excluir item</button>
    {/if}
</div>

<style>
  .card {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
    display: flex;
    flex-flow: wrap;
  }
</style>
