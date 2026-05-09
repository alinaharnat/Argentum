import { Types } from "mongoose";
import { IsMongoId } from "class-validator";
import { Transform } from "class-transformer";

export class DeleteAccountRequest {
  @IsMongoId()
  @Transform(({ value }) => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
