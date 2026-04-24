import { Types } from "mongoose";

export interface IRefreshRequestUser {
  userId: Types.ObjectId;
  refreshTokenId: string;
  refreshToken: string;
}
