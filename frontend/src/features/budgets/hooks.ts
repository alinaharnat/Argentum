import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { budgetsApi } from "./api";
import type {
  CreateBudgetRequest,
  GetBudgetStatusQuery,
  UpdateBudgetRequest,
} from "./types";

const budgetStatusKey = (query?: GetBudgetStatusQuery) =>
  ["budgets", "status", query ?? null] as const;

export function useBudgetStatus(query?: GetBudgetStatusQuery) {
  return useQuery({
    queryKey: budgetStatusKey(query),
    queryFn: () => budgetsApi.status(query),
  });
}

export function useCreateBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useUpdateBudget(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateBudgetRequest) => budgetsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
