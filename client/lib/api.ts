import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // La requête a été faite et le serveur a répondu avec un code d'état
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.error("API Error: No response received");
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const auth = {
  register: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/register", { email, password });
      return response.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
};

export default api;
