import { timerConfirmacaoEmail } from "$lib/stores/cadastroStore";

export function iniciarTimer(duracao = 300) {
  timerConfirmacaoEmail.set(duracao);
  
  const intervalo = setInterval(() => {
    timerConfirmacaoEmail.update(tempo => {
      if (tempo <= 1) {
        clearInterval(intervalo);
        return 0;
      }
      return tempo - 1;
    });
  }, 1000);
  
  return intervalo;
}