import { api } from "../lib/api";
import {
    RegisterPayload,
    LoginPayload,
    User

} from "../types/auth.ts"

export const authService = {
  register: (payload: RegisterPayload) => api.post("/auth/register", payload),
  login: (payload: LoginPayload) => api.post<{ access_token: string; user: User }>("/auth/login", payload),
};
