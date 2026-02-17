// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { user: User; token: string }) => void;
  logout: () => void;
  isLoading: boolean; // ✅ on ajoute isLoading
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // loader initial

  useEffect(() => {
    // 🔹 Exemple : récupérer user et token depuis localStorage au chargement
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setIsLoading(false); // on a fini de charger
  }, []);

  const login = ({ user, token }: { user: User; token: string }) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
