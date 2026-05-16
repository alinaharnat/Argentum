import { Types } from "mongoose";

export interface IValidateOwnershipParams {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
}
