<script lang='ts'>
    import '$lib/styles/form.css'
    import { dadosCadastro, emailConfirmacaoErro, timerConfirmacaoEmail } from "$lib/stores/cadastroStore";
    import { BASE_URL } from "../../../routes/api";
    import { iniciarTimer } from '$lib/utils/iniciarTimer';
    import { formatarTempo } from '$lib/utils/formatarTempo';

    async function enviarCodigoEmail(){
        $emailConfirmacaoErro = '';
        const response = await fetch(BASE_URL + 'users/enviar-codigo-email', {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: $dadosCadastro.User.email,
                nome: $dadosCadastro.User.nome
            })
        });
        if(!response.ok) {
            console.log("Erro ao enviar e-mail de confirmação");
            $emailConfirmacaoErro = "Erro ao enviar e-mail de confirmação"
        }
        else {
            // console.log('aqui')
            iniciarTimer(300)
        }
    }
</script>
<div class="container">
    <form>
        <h1>Aperte o botão abaixo para confirmar o e-mail <strong>{$dadosCadastro.User.email}</strong></h1>
        <button on:click={enviarCodigoEmail} disabled={$timerConfirmacaoEmail > 0}>
            {#if $timerConfirmacaoEmail > 0}
                Aguarde {formatarTempo($timerConfirmacaoEmail)}
            {:else}
                Enviar código e-mail
            {/if}
        </button>
        {#if $emailConfirmacaoErro}
            <p>{$emailConfirmacaoErro}</p>
        {/if}
        {#if $timerConfirmacaoEmail > 0}
            <p>Código enviado! Você pode solicitar um novo código em: <strong>{formatarTempo($timerConfirmacaoEmail)}</strong></p>
        {/if}
        <label for="codigo">Código do e-mail</label>
        <input type="text" name="codigo" id="" bind:value={$dadosCadastro.codigo}>
    </form>
</div>