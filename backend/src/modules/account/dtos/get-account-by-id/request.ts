import { Types } from "mongoose";
import { IsMongoId } from "class-validator";
import { Transform } from "class-transformer";

export class GetAccountByIdRequestDto {
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
