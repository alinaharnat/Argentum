import { Types } from "mongoose";

export interface ISetLoginAttempts {
  userId: Types.ObjectId;
  loginAttempts: number;
}
