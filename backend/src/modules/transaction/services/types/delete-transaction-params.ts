import { Types } from "mongoose";

export interface IDeleteTransactionParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
