import { Types } from "mongoose";

export interface IAccessTokenPayload {
  sub: Types.ObjectId;
}
