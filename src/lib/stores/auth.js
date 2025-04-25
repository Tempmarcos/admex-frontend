import { writable } from "svelte/store";

export const isLoggedIn = writable(false); // Começa como 'false', indica que o usuário não está logado

// Exemplo de como você pode configurar ao verificar um token
export const checkLoginStatus = () => {
  const token = localStorage.getItem("authToken");
  isLoggedIn.set(!!token); // Se existir um token, o usuário está logado
};
