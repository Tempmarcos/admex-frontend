<script lang='ts'>
    import { page } from "$app/state";
    import { confirmar_senha, emailConfirmacaoErro, mensagemEmail, senhaInputErro, userCadastro } from "$lib/stores/cadastroUserStore";
    import '$lib/styles/form.css'
    import { checkEmailExists } from "$lib/utils/checkEmailExists";
    import { validateEmail } from "$lib/utils/validarEmail";
    import { submitCadastroUser } from "$lib/utils/user/submitCadastroUser";
    import Card from "$lib/components/Card.svelte";
    import { verificarConvite } from "$lib/utils/user/verificarConvite";
    import { iniciarTimer } from "$lib/utils/iniciarTimer";
    import { BASE_URL } from "../../../api";
    import { timerConfirmacaoEmail } from "$lib/stores/cadastroStore";
    import { formatarTempo } from "$lib/utils/formatarTempo";
    import { onMount } from "svelte";

    $: token = page.params.token

    $: erroSenha = $senhaInputErro;

    let campoEnviarCodigoEmail = false;

    function validarSenhas() {
        if ($userCadastro.user.senha && $confirmar_senha && $userCadastro.user.senha !== $confirmar_senha) {
            $senhaInputErro= "As senhas não coincidem.";
        } else {
            $senhaInputErro = "";
        }
    }

     async function enviarCodigoEmail(){
        $emailConfirmacaoErro = '';
        const response = await fetch(BASE_URL + 'users/enviar-codigo-email', {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: $userCadastro.user.email,
                nome: $userCadastro.user.nome
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

    let debounceTimeout : any = null;
    function handleInputEmail(){
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            (async () => {
            const email = $userCadastro.user.email;
            // console.log(email) 
            if (validateEmail(email)) {
                const resposta = await checkEmailExists(email);
                if (resposta === false) {
                    $mensagemEmail = {"mensagem": "E-mail já cadastrado", "cor": "red"}
                } else  if (resposta === true){
                    $mensagemEmail = {"mensagem": "E-mail disponível!", "cor": "green"}
                    campoEnviarCodigoEmail = true;
                }else {
                    $mensagemEmail = {"mensagem": "Erro ao verificar e-mail.", "cor": "orange"};
                    campoEnviarCodigoEmail = true;
                }
            } else {
                $mensagemEmail = {"mensagem": "Digite um e-mail válido.", "cor": "gray"}
            }
            })();
        }, 500);
    };

    let conviteVerificado : any;

    onMount(async ()=> {
        conviteVerificado = await verificarConvite(token);

        // console.log(conviteVerificado)

    })
</script>
<main>
    {#if conviteVerificado === undefined}
        <Card>
            <div class="container" style="height: 100px;">
                <p>Verificando convite...</p>
            </div>
        </Card>
    {:else if conviteVerificado.valid == false}
        <Card>
            <div class="container" style="height: 100px;">
                {conviteVerificado.message}
            </div>
        </Card>
    {:else}
    <h1 class="title">Começe a criar sua conta</h1>
    <Card>
        <div class="container">
            <form>
            <h1>Crie seu usuário</h1>
            <label for="nome">Nome</label>
            <input type="text" name="nome" bind:value={$userCadastro.user.nome} required />
            <label for="email">Email</label>
            <input type="email" name="email" bind:value={$userCadastro.user.email} required id="email" oninput={handleInputEmail}/>
            {#if $mensagemEmail}
                <p id="email-status" style="margin-block: 0; color: {$mensagemEmail.cor}">{$mensagemEmail.mensagem}</p>
            {/if}
            {#if campoEnviarCodigoEmail}
                <button onclick={enviarCodigoEmail} disabled={$timerConfirmacaoEmail > 0}>
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
                <input type="text" name="codigo" id="" bind:value={$userCadastro.codigo}>
            {/if}
            <label for="senha">Senha</label>
            <input type="password" name="senha"
            bind:value={$userCadastro.user.senha} oninput={validarSenhas} minlength="6" required />
            <label for="confirmarSenha">Confirmar senha</label>
            <input type="password"
            bind:value={$confirmar_senha} oninput={validarSenhas} 
            name="confirmarSenha" minlength="6" required />
            {#if erroSenha}
                <p style="color: red;">{erroSenha}</p>
            {/if}
            <button type="submit" onclick={() => submitCadastroUser(token)}>Cadastrar</button>
            </form>
        </div>
    </Card>
    {/if}
</main>