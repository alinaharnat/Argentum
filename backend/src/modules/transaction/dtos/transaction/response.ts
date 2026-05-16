import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";
import { TransactionType } from "../../enums";

@Exclude()
export class TransactionResponseDto {
  constructor(partial: Partial<TransactionResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  _id: Types.ObjectId;

  @Expose()
  @Transform(({ value }) => value?.toString())
  userId: Types.ObjectId;

  @Expose()
  @Transform(({ value }) => value?.toString())
  accountId: Types.ObjectId;

  @Expose()
  @Transform(({ value }) => value?.toString())
  categoryId: Types.ObjectId;

  @Expose()
  amount: number;

  @Expose()
  type: TransactionType;

  @Expose()
  @Type(() => Date)
  date: Date;

  @Expose()
  description?: string;
}
