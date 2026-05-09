import { IsMongoId } from "class-validator";
import { Transform } from "class-transformer";
import { Types } from "mongoose";

export class EditAccountRequestParamsDto {
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
