import { Types } from "mongoose";
import { CategoryType, CategoryScope } from "../../enums";

export interface IGetCategoriesParams {
  userId: Types.ObjectId;
  scope: CategoryScope;
  type?: CategoryType;
  name?: string;
}
