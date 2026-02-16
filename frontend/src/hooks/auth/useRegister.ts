import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";
import { RegisterPayload, User } from "../../types/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data: { data: { access_token: string; user: User } }) => {
      localStorage.setItem("access_token", data.data.access_token);
    },
  });
};