import { Types } from "mongoose";

export interface IGetTransactionByIdParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
