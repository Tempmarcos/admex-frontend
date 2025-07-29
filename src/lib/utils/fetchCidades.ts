import { cidades, estados } from "$lib/stores/cadastroStore";
import { get } from "svelte/store";

export async function fetchCidades(event: any) {
    let sigla : string;
    const estadosStore = await get(estados)
    try {
      sigla = event.target.value;
    } catch {
      sigla = event;
    }
    const estado : any = estadosStore.find((e: any) => e.sigla === sigla);
    console.log(estado);
    try {
      const res = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado!.id}/municipios`
      );
      const data = await res.json();
      cidades.set(data.sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      console.log(cidades);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  }