import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "./api";

export function useSummary(period?: string) {
  return useQuery({
    queryKey: ["analytics", "summary", period ?? null] as const,
    queryFn: () => analyticsApi.summary(period),
  });
}

export function useExpensesByCategory(period?: string) {
  return useQuery({
    queryKey: ["analytics", "expenses-by-category", period ?? null] as const,
    queryFn: () => analyticsApi.expensesByCategory(period),
  });
}

export function useMonthlyStats(year?: number) {
  return useQuery({
    queryKey: ["analytics", "monthly", year ?? null] as const,
    queryFn: () => analyticsApi.monthly(year),
  });
}
