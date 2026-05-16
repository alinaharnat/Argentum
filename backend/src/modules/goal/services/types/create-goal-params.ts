import { Types } from "mongoose";

export interface ICreateGoalParams {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: Date;
}
