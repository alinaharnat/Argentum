import { Allow } from "class-validator";
import { Transform } from "class-transformer";
import { Types } from "mongoose";

export class EditAccountRequestParamsDto {
  @Allow()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
