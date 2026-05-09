import { IsMongoId } from "class-validator";
import { Transform } from "class-transformer";
import { Types } from "mongoose";

export class EditAccountRequestQueryDto {
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
