import { Transform } from "class-transformer";
import { Allow } from "class-validator";
import { Types } from "mongoose";

export class CategoryRequestParams {
  @Allow()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
