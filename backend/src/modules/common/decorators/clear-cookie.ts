import { SetMetadata } from "@nestjs/common";
import { CookieMetadataKey } from "../enums";
import { IClearCookieMetadata } from "../types";

export const ClearCookie = (metadata: IClearCookieMetadata) =>
  SetMetadata(CookieMetadataKey.ClearCookie, metadata);
