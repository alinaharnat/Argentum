import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  withCredentials: true,
});

const MESSAGE_TRANSLATIONS: Record<string, string> = {
  "Invalid credentials": "Невірний email або пароль",
};

function translateMessage(message: string): string {
  return MESSAGE_TRANSLATIONS[message] ?? message;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data?.message) {
      if (Array.isArray(data.message))
        return data.message.map(translateMessage).join(", ");
      return translateMessage(String(data.message));
    }
    if (error.code === "ERR_NETWORK") {
      return "Сервер недоступний. Переконайтесь що backend запущено.";
    }
    return error.message;
  }
  return "Невідома помилка";
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  },
);
