import { Types } from "mongoose";
import { Allow } from "class-validator";
import { Transform } from "class-transformer";

export class GetAccountByIdRequestDto {
  @Allow()
  @Transform(({ value }) => new Types.ObjectId(value))
  id: Types.ObjectId;
}
