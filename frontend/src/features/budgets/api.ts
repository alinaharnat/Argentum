import { api } from "@/lib/axios";
import type {
  Budget,
  CreateBudgetRequest,
  GetBudgetStatusQuery,
  GetBudgetStatusResponse,
  UpdateBudgetRequest,
} from "./types";

export const budgetsApi = {
  status: async (
    query?: GetBudgetStatusQuery,
  ): Promise<GetBudgetStatusResponse> => {
    const response = await api.get<GetBudgetStatusResponse>("/budgets/status", {
      params: query,
    });
    return response.data;
  },
  create: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await api.post<Budget>("/budgets", data);
    return response.data;
  },
  update: async (id: string, data: UpdateBudgetRequest): Promise<Budget> => {
    const response = await api.patch<Budget>(`/budgets/${id}`, data);
    return response.data;
  },
};
