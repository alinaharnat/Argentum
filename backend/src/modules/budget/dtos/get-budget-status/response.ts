import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

@Exclude()
export class BudgetStatusResponseDto {
  constructor(partial: Partial<BudgetStatusResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  budgetId: Types.ObjectId;

  @Expose()
  @Transform(({ value }) => value?.toString())
  categoryId: Types.ObjectId;

  @Expose()
  period: string;

  @Expose()
  amountLimit: number;

  @Expose()
  spent: number;

  @Expose()
  remaining: number;

  @Expose()
  isExceeded: boolean;
}

@Exclude()
export class GetBudgetStatusResponseDto {
  constructor(partial: Partial<GetBudgetStatusResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => BudgetStatusResponseDto)
  data: BudgetStatusResponseDto[];
}
