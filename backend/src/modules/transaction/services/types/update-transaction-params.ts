import { Types } from "mongoose";
import { TransactionType } from "../../enums";

export interface IUpdateTransactionParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  accountId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
  amount?: number;
  type?: TransactionType;
  date?: Date;
  description?: string;
}
