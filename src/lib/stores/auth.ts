import { writable } from "svelte/store";

export const isLoggedIn = writable(false); // Começa como 'false', indica que o usuário não está logado

// Exemplo de como você pode configurar ao verificar um token
export const checkLoginStatus = () => {
  const token = localStorage.getItem("authToken");
  isLoggedIn.set(!!token); // Se existir um token, o usuário está logado
};

export const usuario = writable(
  localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')!) : null
);

export const token = writable(localStorage.getItem('token') || null);

usuario.subscribe(value => {
  if (value) {
    localStorage.setItem('usuario', JSON.stringify(value));
  } else {
    localStorage.removeItem('usuario');
  }
});

token.subscribe(value => {
  if (value) {
    localStorage.setItem('token', value);
  } else {
    localStorage.removeItem('token');
  }
});