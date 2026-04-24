import type { Request } from "express";
import { IRefreshRequestUser } from "./refresh-request-user";

export interface IRefreshRequest extends Request {
  user: IRefreshRequestUser;
}
