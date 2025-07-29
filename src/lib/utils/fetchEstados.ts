import { estados } from "$lib/stores/cadastroStore";

export async function fetchEstados() {
    try {
      const resposta = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      );
      if (!resposta.ok) {
        const texto = await resposta.text();
        console.error("Erro na resposta da API:", resposta.status, texto);
        return;
      }
      const data = await resposta.json();
      estados.set(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      
      //console.log(estados);
    } catch (error) {
      throw error;
    }
  }