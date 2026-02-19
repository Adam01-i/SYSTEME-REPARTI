// frontend/src/lib/api.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Instance Axios principale
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://192.168.49.2:30001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // mettre true si tu utilises cookies plus tard
});

/**
 * 🔐 Interceptor REQUEST
 * Injecte automatiquement le token JWT dans chaque requête
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 🚨 Interceptor RESPONSE
 * Gère automatiquement :
 * - erreurs 401 (token expiré)
 * - erreurs serveur
 * - erreurs réseau
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (!error.response) {
      console.error("Erreur réseau ou serveur injoignable");
      return Promise.reject("Serveur injoignable");
    }

    const { status, data } = error.response;

    // 🔒 Token expiré ou invalide
    if (status === 401) {
      localStorage.removeItem("access_token");

      // Redirection vers login
      window.location.href = "/login";

      return Promise.reject("Session expirée. Veuillez vous reconnecter.");
    }

    // ❌ Erreur backend avec message
    if (data?.message) {
      return Promise.reject(data.message);
    }

    return Promise.reject("Une erreur est survenue.");
  }
);
