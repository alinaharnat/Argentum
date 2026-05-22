import { api } from "@/lib/axios";
import type {
  CreateGoalRequest,
  GetGoalsResponse,
  Goal,
  UpdateGoalRequest,
} from "./types";

export const goalsApi = {
  list: async (): Promise<GetGoalsResponse> => {
    const response = await api.get<GetGoalsResponse>("/goals");
    return response.data;
  },
  create: async (data: CreateGoalRequest): Promise<Goal> => {
    const response = await api.post<Goal>("/goals", data);
    return response.data;
  },
  update: async (id: string, data: UpdateGoalRequest): Promise<Goal> => {
    const response = await api.patch<Goal>(`/goals/${id}`, data);
    return response.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },
};
