import { get } from "svelte/store";
import { usuarioLogado } from "../login";

const userPermissions = get(usuarioLogado).permissoes;

export function hasPermission(permission: string) {
    return userPermissions.includes(permission);
  }