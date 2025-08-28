<script lang="ts">
    import { cancelarConvite } from "$lib/utils/user/cancelarConvite";
    import { FRONTEND_LINK } from "../../routes/api";

  let { id, token, created_at, created_by, cancelado, usado, used_by, expires_at } = $props();

  let value = FRONTEND_LINK + "/cadastro/user/" + token;
  let isExpired = new Date(expires_at).getTime() < Date.now();
</script>

<div class="convite">
  <input type="text" readonly {value}>
  <p>Criado por: {created_by} em: {created_at}</p> 
  {#if usado || used_by}
    <p>Usado por: {used_by}</p>
  {:else if cancelado}
    <p>Convite cancelado</p>
  {:else if isExpired}
    <p>Convite expirado</p>
  {/if}
  {#if !usado && !cancelado && !isExpired}
    <button onclick={() => cancelarConvite(id)}>Cancelar convite</button>
  {/if}

</div>

<style>
  .convite {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column !important;
    flex-flow: wrap;
  }
</style>
