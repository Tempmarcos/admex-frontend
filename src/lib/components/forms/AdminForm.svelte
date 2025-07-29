<script>
    import { dadosCadastro } from "$lib/stores/cadastroStore";

    let nome = '';
    let email = '';
    let senha = '';
    let confirmarSenha = '';
    let senhaErro = '';

   $: dadosCadastro.update(current => ({
        ...current,
        nome,
        email,
        senha
    }));

    function validarSenhas() {
        if (senha && confirmarSenha && senha !== confirmarSenha) {
            senhaErro = "As senhas não coincidem.";
        } else {
            senhaErro = "";
        }
    }
</script>

<div>
    <h1>Crie seu usuário admin</h1>
    <label for="nome">Nome</label>
    <input type="text" name="nome" bind:value={nome} required />
    <label for="email">Email</label>
    <input type="email" name="email" bind:value={email} required id="email" />
    <p id="email-status" style="margin-block: 0;"></p>
    <label for="senha">Senha</label>
    <input type="password" name="senha"
     bind:value={senha} on:input={validarSenhas} minlength="6" required />
    <label for="confirmarSenha">Confirmar senha</label>
    <input type="password"
    bind:value={confirmarSenha} on:input={validarSenhas} 
    name="confirmarSenha" minlength="6" required />
    {#if senhaErro}
        <p style="color: red;">{senhaErro}</p>
    {/if}
</div>