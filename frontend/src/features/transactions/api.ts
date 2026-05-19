import { api } from "@/lib/axios";
import type {
  CreateTransactionRequest,
  GetTransactionsQuery,
  GetTransactionsResponse,
  Transaction,
  UpdateTransactionRequest,
} from "./types";

export const transactionsApi = {
  list: async (
    query?: GetTransactionsQuery,
  ): Promise<GetTransactionsResponse> => {
    const response = await api.get<GetTransactionsResponse>("/transactions", {
      params: query,
    });
    return response.data;
  },
  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transactions", data);
    return response.data;
  },
  update: async (
    id: string,
    data: UpdateTransactionRequest,
  ): Promise<Transaction> => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
