import { api } from "@/lib/axios";
import type {
  Account,
  CreateAccountRequest,
  EditAccountRequest,
  GetAccountsQuery,
  GetAccountsResponse,
} from "./types";

export const accountsApi = {
  list: async (query?: GetAccountsQuery): Promise<GetAccountsResponse> => {
    const response = await api.get<GetAccountsResponse>("/accounts", {
      params: query,
    });
    return response.data;
  },
  getById: async (id: string): Promise<Account> => {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },
  create: async (data: CreateAccountRequest): Promise<Account> => {
    const response = await api.post<Account>("/accounts", data);
    return response.data;
  },
  edit: async (id: string, data: EditAccountRequest): Promise<Account> => {
    const response = await api.patch<Account>(`/accounts/${id}`, data);
    return response.data;
  },
  activate: async (id: string): Promise<Account> => {
    const response = await api.patch<Account>(`/accounts/${id}/activation`);
    return response.data;
  },
  deactivate: async (id: string): Promise<Account> => {
    const response = await api.delete<Account>(`/accounts/${id}`);
    return response.data;
  },
};
