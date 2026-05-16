import { CategoryType } from "../../enums/category-types";
import { Types } from "mongoose";

export interface IValidateCreateCategoryCreateParams {
  userId: Types.ObjectId;
  name: string;
  type: CategoryType;
}
