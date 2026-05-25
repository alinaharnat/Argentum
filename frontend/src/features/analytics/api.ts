import { api } from "@/lib/axios";
import type {
  ExpensesByCategoryResponse,
  MonthlyStatsResponse,
  Summary,
} from "./types";

export const analyticsApi = {
  summary: async (period?: string): Promise<Summary> => {
    const response = await api.get<Summary>("/analytics/summary", {
      params: period ? { period } : undefined,
    });
    return response.data;
  },
  expensesByCategory: async (
    period?: string,
  ): Promise<ExpensesByCategoryResponse> => {
    const response = await api.get<ExpensesByCategoryResponse>(
      "/analytics/expenses-by-category",
      { params: period ? { period } : undefined },
    );
    return response.data;
  },
  monthly: async (year?: number): Promise<MonthlyStatsResponse> => {
    const response = await api.get<MonthlyStatsResponse>("/analytics/monthly", {
      params: year ? { year } : undefined,
    });
    return response.data;
  },
};
