import { SetMetadata } from "@nestjs/common";
import { ISetCookieMetadata } from "../types";
import { CookieMetadataKey } from "../enums";

export const SetCookie = (metadata: ISetCookieMetadata) =>
  SetMetadata(CookieMetadataKey.SetCookie, metadata);
