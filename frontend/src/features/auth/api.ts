import { api } from "@/lib/axios";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/registration", data);
    return response.data;
  },
  refresh: async (): Promise<AuthResponse> => {
    const response = await api.patch<AuthResponse>("/auth/tokens");
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.delete("/auth/logout");
  },
};
