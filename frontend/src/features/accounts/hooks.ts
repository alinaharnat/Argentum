import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "./api";
import type {
  CreateAccountRequest,
  EditAccountRequest,
  GetAccountsQuery,
} from "./types";

const accountsKey = (query?: GetAccountsQuery) =>
  ["accounts", query ?? null] as const;

export function useAccounts(query?: GetAccountsQuery) {
  return useQuery({
    queryKey: accountsKey(query),
    queryFn: () => accountsApi.list(query),
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useEditAccount(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EditAccountRequest) => accountsApi.edit(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useActivateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsApi.activate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useDeactivateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountsApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
