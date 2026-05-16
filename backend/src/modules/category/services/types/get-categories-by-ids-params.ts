import { Types } from "mongoose";

export interface IGetCategoriesByIdsParams {
  userId: Types.ObjectId;
  ids: Types.ObjectId[];
}
