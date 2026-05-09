import { Types } from "mongoose";

export interface ISetAccountStatusParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  isActive: boolean;
}
