import localStorageService from "../services/localStorageService";
import { roleSystem } from "../role";
export const authRoles = {
  sa: ['SA'],
  admin: ['SA', 'ADMIN'],
  editor: ['SA', 'ADMIN', 'EDITOR'],
  guest: ['SA', 'ADMIN', 'EDITOR', 'GUEST']
}

export const isAdmin = (user) => {
  if (user == null) user = localStorageService.getItem("auth_user");
  if (user != null && user.is_superuser) {
    return true;
  }
  return false;
}

export const isHost = (user) => {
  if (user == null) user = localStorageService.getItem("auth_user");
  if (user != null && user.is_staff) {
    return true;
  }
  return false;
}

export const isUser = (user) => {
  if (user == null) user = localStorageService.getItem("auth_user");
  if (user != null && user.is_user) {
    return true;
  }

  return false;
}