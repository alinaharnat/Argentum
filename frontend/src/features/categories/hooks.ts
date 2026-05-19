import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./api";
import type {
  CreateCategoryRequest,
  GetCategoriesQuery,
  UpdateCategoryRequest,
} from "./types";

const categoriesKey = (query?: GetCategoriesQuery) =>
  ["categories", query ?? null] as const;

export function useCategories(query?: GetCategoriesQuery) {
  return useQuery({
    queryKey: categoriesKey(query),
    queryFn: () => categoriesApi.list(query),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoriesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryRequest) => categoriesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
