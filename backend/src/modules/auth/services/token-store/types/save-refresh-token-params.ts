import { Types } from "mongoose";

export interface SaveRefreshTokenParams {
  userId: Types.ObjectId;
  refreshToken: {
    jti: string;
    token: string;
    expiresAt: Date;
  };
}
