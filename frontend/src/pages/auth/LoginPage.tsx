// frontend/src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useLogin } from "../../hooks//auth/useLogin"; // ton hook basé sur React Query
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { mutateAsync: loginMutation, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

// frontend/src/pages/auth/LoginPage.tsx
// ...
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await loginMutation({ email, password });
    const { access_token, user } = response.data;

    // ✅ Utilise la bonne structure attendue par le contexte
    authLogin({ user, token: access_token });

    toast.success("Connexion réussie !");
    navigate("/dashboard");
  } catch (err: any) {
    console.error("Erreur de connexion :", err);
    toast.error(err?.response?.data?.msg || "Échec de la connexion. Vérifiez vos identifiants.");
  }
};


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            className="bg-white p-2 rounded-full shadow-lg"
          >
            <LogIn className="h-12 w-12 text-blue-600" />
          </motion.div>
        </div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center text-3xl font-extrabold text-gray-900"
        >
          Bienvenue sur LuxStay
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-2 text-center text-sm text-gray-600"
        >
          Pas encore de compte ?{" "}
          <motion.span whileHover={{ scale: 1.05 }}>
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Créer un compte
            </Link>
          </motion.span>
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Se souvenir de moi</label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Mot de passe oublié ?</a>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : "Se connecter"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
