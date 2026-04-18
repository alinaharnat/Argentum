import { CookieOptions } from "express";
import { CookieKey } from "../../enums";

export interface ISetCookieMetadata {
  key: CookieKey;
  valuePath: string;
  options?: CookieOptions;
}
