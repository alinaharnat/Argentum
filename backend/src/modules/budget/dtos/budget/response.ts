import { Exclude, Expose, Transform } from "class-transformer";
import { Types } from "mongoose";

@Exclude()
export class BudgetResponseDto {
  constructor(partial: Partial<BudgetResponseDto>) {
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
  categoryId: Types.ObjectId;

  @Expose()
  amountLimit: number;

  @Expose()
  period: string;
}
