import { Types } from "mongoose";

export interface IRefreshTokenPayload {
  sub: Types.ObjectId;
  refreshTokenId: string;
}
