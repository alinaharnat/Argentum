import { Types } from "mongoose";
import { GetUserTransactionsRequestQueryDto } from "../../dtos";

export interface IGetUserTransactionsParams {
  userId: Types.ObjectId;
  query: GetUserTransactionsRequestQueryDto;
}
