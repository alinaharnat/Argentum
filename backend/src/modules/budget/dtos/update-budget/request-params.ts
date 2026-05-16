import { Allow } from "class-validator";
import { Transform } from "class-transformer";
import { Types } from "mongoose";

export class UpdateBudgetRequestParamsDto {
  @Allow()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
