import { Types } from "mongoose";

export interface IGetAccountByIdParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
