import { Types } from "mongoose";

export interface IUpdateGoalParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  currency?: string;
  targetDate?: Date;
}
