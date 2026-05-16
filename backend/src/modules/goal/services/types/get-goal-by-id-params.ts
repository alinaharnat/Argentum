import { Types } from "mongoose";

export interface IGetGoalByIdParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
