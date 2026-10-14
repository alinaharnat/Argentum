import axios, { AxiosError } from "axios";
import i18n from "./i18n";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  withCredentials: true,
});

const MESSAGE_TRANSLATION_KEYS: Record<string, string> = {
  "Invalid credentials": "errors.api.invalidCredentials",
  "User does not exist": "errors.api.userNotFound",
  "User not found": "errors.api.userNotFound",
  "Email already exists": "errors.api.emailExists",
  "User already exists": "errors.api.userExists",
};

function translateMessage(message: string): string {
  const translationKey = MESSAGE_TRANSLATION_KEYS[message];
  if (translationKey) {
    return i18n.t(translationKey as any);
  }
  return message;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (data?.message) {
      if (Array.isArray(data.message)) {
        return data.message.map(translateMessage).join(", ");
      }
      return translateMessage(String(data.message));
    }
    if (error.code === "ERR_NETWORK") {
      return i18n.t("errors.networkError");
    }
    return error.message;
  }
  return i18n.t("errors.unknownError");
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["Accept-Language"] = i18n.language || "uk";

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