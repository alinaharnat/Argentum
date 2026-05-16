import { Types } from "mongoose";

export interface IGetBudgetStatusParams {
  userId: Types.ObjectId;
  period?: string;
  categoryId?: Types.ObjectId;
}
