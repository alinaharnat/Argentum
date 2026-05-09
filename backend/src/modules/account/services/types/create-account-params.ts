import { Types } from "mongoose";

export interface ICreateAccountParams {
  userId: Types.ObjectId;
  name: string;
  type: string;
  balance?: number;
  currency?: string;
}
