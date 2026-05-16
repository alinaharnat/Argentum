import { Types } from "mongoose";

export interface IDeleteGoalParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
