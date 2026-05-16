import { Types } from "mongoose";
import { CategoryType } from "../../enums/category-types";
import { IconName } from "../../enums/icon-name";

export interface ICreateCategoryCreateParams {
  userId: Types.ObjectId;
  name: string;
  type: CategoryType;
  icon?: IconName;
  color?: string;
}
