import { Exclude, Expose, Transform } from "class-transformer";
import { Types } from "mongoose";

@Exclude()
export class ProfileResponseDto {
  constructor(partial: Partial<ProfileResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  _id: Types.ObjectId;

  @Expose()
  email: string;

  @Expose()
  firstName?: string;

  @Expose()
  lastName?: string;
}
