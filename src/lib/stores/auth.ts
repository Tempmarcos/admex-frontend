import { writable } from "svelte/store";
import { browser } from "$app/environment";

export const token = writable<string | null>(null);
export const usuario = writable<any>(null);

if (browser) {
  const storedToken = localStorage.getItem("token");
  const storedUser = localStorage.getItem("usuario");

  if (storedToken) token.set(storedToken);
  if (storedUser) usuario.set(JSON.parse(storedUser));

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
}