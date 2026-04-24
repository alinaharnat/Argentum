import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "../../../../../modules/auth/types";

export type TGenerateTokenPayload = IAccessTokenPayload | IRefreshTokenPayload;
