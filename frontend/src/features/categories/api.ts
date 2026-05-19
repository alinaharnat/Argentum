import { api } from "@/lib/axios";
import type {
  Category,
  CreateCategoryRequest,
  GetCategoriesQuery,
  GetCategoriesResponse,
  UpdateCategoryRequest,
} from "./types";

export const categoriesApi = {
  list: async (query?: GetCategoriesQuery): Promise<GetCategoriesResponse> => {
    const response = await api.get<GetCategoriesResponse>("/categories", {
      params: query,
    });
    return response.data;
  },
  getById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<Category>("/categories", data);
    return response.data;
  },
  update: async (id: string, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
