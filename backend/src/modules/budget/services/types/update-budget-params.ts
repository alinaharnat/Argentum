import { Types } from "mongoose";

export interface IUpdateBudgetParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amountLimit?: number;
}
