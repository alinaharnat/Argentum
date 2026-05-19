import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "./api";
import type {
  CreateTransactionRequest,
  GetTransactionsQuery,
  UpdateTransactionRequest,
} from "./types";

const transactionsKey = (query?: GetTransactionsQuery) =>
  ["transactions", query ?? null] as const;

function invalidateAll(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: ["transactions"] });
  qc.invalidateQueries({ queryKey: ["accounts"] });
  qc.invalidateQueries({ queryKey: ["analytics"] });
  qc.invalidateQueries({ queryKey: ["budgets"] });
}

export function useTransactions(query?: GetTransactionsQuery) {
  return useQuery({
    queryKey: transactionsKey(query),
    queryFn: () => transactionsApi.list(query),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionsApi.create(data),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useUpdateTransaction(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateTransactionRequest) =>
      transactionsApi.update(id, data),
    onSuccess: () => invalidateAll(qc),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionsApi.remove(id),
    onSuccess: () => invalidateAll(qc),
  });
}
