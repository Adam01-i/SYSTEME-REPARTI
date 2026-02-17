// frontend/src/types/auth.ts
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user"; // ou string si plus flexible
}
