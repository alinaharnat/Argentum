export const GoalStatus = {
  Active: "ACTIVE",
  Completed: "COMPLETED",
  Cancelled: "CANCELLED",
} as const;
export type GoalStatus = (typeof GoalStatus)[keyof typeof GoalStatus];

export interface Goal {
  _id: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  remainingAmount: number;
  progressPercentage: number;
  currency: string;
  targetDate?: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: string;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: string;
}

export interface GetGoalsResponse {
  data: Goal[];
}
