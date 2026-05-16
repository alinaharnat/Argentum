import { Types } from "mongoose";
import { GetUserGoalsRequestQueryDto } from "../../dtos";

export interface IGetUserGoalsParams {
  userId: Types.ObjectId;
  query: GetUserGoalsRequestQueryDto;
}
