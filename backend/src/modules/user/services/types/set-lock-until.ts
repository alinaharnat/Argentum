import { Types } from "mongoose";

export interface ISetLockUntil {
  userId: Types.ObjectId;
  lockUntil: Date;
}
