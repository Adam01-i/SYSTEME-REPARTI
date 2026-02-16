// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { User, LoginPayload, RegisterPayload } from "../types/auth";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  sub: string; // user id
  role: string;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Check si token dans localStorage au démarrage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser({
          id: decoded.sub,
          name: "", // on peut stocker le nom complet dans le localStorage si nécessaire
          role: decoded.role,
        });
      } catch (err) {
        console.error("JWT invalide", err);
        localStorage.removeItem("access_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      const { access_token, user } = res.data;

      localStorage.setItem("access_token", access_token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      const { access_token, user } = res.data;

      localStorage.setItem("access_token", access_token);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pratique
export const useAuth = () => useContext(AuthContext);
