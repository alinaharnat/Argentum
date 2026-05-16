import { Types } from "mongoose";

export interface IGetCategoryByIdParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
