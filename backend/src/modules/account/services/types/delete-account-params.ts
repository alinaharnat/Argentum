import { Types } from "mongoose";

export interface IDeleteAccountParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
