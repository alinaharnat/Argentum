import { Types } from "mongoose";

export interface IGenerateAuthTokensParams {
  userId: Types.ObjectId;
  refreshTokenId: string;
}
