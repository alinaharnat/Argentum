import { Exclude, Expose } from "class-transformer";
import { Types } from "mongoose";

@Exclude()
export class AccountResponseDto {
  constructor(partial: Partial<AccountResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  _id: Types.ObjectId;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  balance: number;

  @Expose()
  currency: string;

  @Expose()
  isActive: boolean;
}
