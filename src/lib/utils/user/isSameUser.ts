import { get } from "svelte/store"
import { usuarioLogado } from "../login"

export function isSameUser(id: string) : boolean{
    let userId = get(usuarioLogado).id;
    return userId == id
}