<script lang='ts'>
    import '$lib/styles/form.css'
    import { confirmar_senha, dadosCadastro, mensagemEmail, senhaInputErro } from "$lib/stores/cadastroStore";
    import { checkEmailExists } from "$lib/utils/checkEmailExists";
    import { validateEmail } from "$lib/utils/validarEmail";

    $: erroSenha = $senhaInputErro;

    function validarSenhas() {
        if ($dadosCadastro.senha && $confirmar_senha && $dadosCadastro.senha !== $confirmar_senha) {
            $senhaInputErro= "As senhas não coincidem.";
        } else {
            $senhaInputErro = "";
        }
    }

    let debounceTimeout : any = null;
    function handleInputEmail(){
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            (async () => {
            const email = $dadosCadastro.email;
            // console.log(email) 
            if (validateEmail(email)) {
                const resposta = await checkEmailExists(email);
                if (resposta === false) {
                    $mensagemEmail = {"mensagem": "E-mail já cadastrado", "cor": "red"}
                } else  if (resposta === true){
                    $mensagemEmail = {"mensagem": "E-mail disponível!", "cor": "green"}
                }else {
                    $mensagemEmail = {"mensagem": "Erro ao verificar e-mail.", "cor": "orange"};
                }
            } else {
                $mensagemEmail = {"mensagem": "Digite um e-mail válido.", "cor": "gray"}
            }
            })();
        }, 500);
    };
</script>
<div class="container">
    <form>
    <h1>Crie seu usuário admin</h1>
    <label for="nome">Nome</label>
    <input type="text" name="nome" bind:value={$dadosCadastro.nome} required />
    <label for="email">Email</label>
    <input type="email" name="email" bind:value={$dadosCadastro.email} required id="email" oninput={handleInputEmail}/>
    {#if $mensagemEmail}
        <p id="email-status" style="margin-block: 0; color: {$mensagemEmail.cor}">{$mensagemEmail.mensagem}</p>
    {/if}
    <label for="senha">Senha</label>
    <input type="password" name="senha"
     bind:value={$dadosCadastro.senha} oninput={validarSenhas} minlength="6" required />
    <label for="confirmarSenha">Confirmar senha</label>
    <input type="password"
    bind:value={$confirmar_senha} oninput={validarSenhas} 
    name="confirmarSenha" minlength="6" required />
    {#if erroSenha}
        <p style="color: red;">{erroSenha}</p>
    {/if}
    </form>
</div>