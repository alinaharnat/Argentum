import { Types } from "mongoose";
import { GetAccountsQueryDto } from "../../dtos";

export interface IGetUserAccountsParams {
  userId: Types.ObjectId;
  query: GetAccountsQueryDto;
}
