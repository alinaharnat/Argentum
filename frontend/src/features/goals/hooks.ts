import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { goalsApi } from "./api";
import type { CreateGoalRequest, UpdateGoalRequest } from "./types";

export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: () => goalsApi.list(),
  });
}

export function useCreateGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalRequest) => goalsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoal(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGoalRequest) => goalsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useDeleteGoal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => goalsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
