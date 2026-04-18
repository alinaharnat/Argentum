import { CookieOptions } from "express";
import { CookieKey } from "../../enums";

export interface IClearCookieMetadata {
  key: CookieKey;
  options?: CookieOptions;
}
