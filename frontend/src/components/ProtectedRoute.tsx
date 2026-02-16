// frontend/src/components/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string; // ex: "admin", "user"
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();

  // 1️⃣ On peut afficher un loader si l'état est en cours de récupération
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2️⃣ Si l'utilisateur n'est pas connecté → redirection vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Si un rôle est requis et que l'utilisateur n'a pas ce rôle → redirection vers login ou home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  // 4️⃣ Sinon on rend le contenu
  return <>{children}</>;
};
