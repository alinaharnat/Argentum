import { Types } from "mongoose";

export interface IDeleteCategoryParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
