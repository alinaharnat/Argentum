import { Types } from "mongoose";

export interface IEditAccountParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name?: string;
  type?: string;
  balance?: number;
  currency?: string;
}
