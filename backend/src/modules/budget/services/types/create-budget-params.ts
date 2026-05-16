import { Types } from "mongoose";

export interface ICreateBudgetParams {
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amountLimit: number;
  period: string;
}
