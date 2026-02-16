import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { LoginPayload, User } from "../../types/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data: { data: { access_token: string; user: User } }) => {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    },
  });
};