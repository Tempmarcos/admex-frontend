const BASE_URL = "https://seu-servidor.com/api";

/**
 * @param {any} endpoint
 */
export async function get(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`Erro ao buscar ${endpoint}: ${res.statusText}`);
  }

  return await res.json();
}

// Você pode adicionar mais métodos se quiser:
/**
 * @param {any} endpoint
 * @param {any} data
 */
export async function post(endpoint, data) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Erro ao enviar para ${endpoint}: ${res.statusText}`);
  }

  return await res.json();
}
