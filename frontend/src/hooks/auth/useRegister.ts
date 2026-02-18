// frontend/src/hooks/auth/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { User } from "../../types/auth";

export interface RegisterResponse {
  access_token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await axios.post<RegisterResponse>(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        payload
      );
      return response.data; // ✅ ici, data a déjà access_token et user
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.status === "pending",
    error: mutation.error,
  };
};
