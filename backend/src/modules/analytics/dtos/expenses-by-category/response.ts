import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";

@Exclude()
export class ExpenseByCategoryItemDto {
  constructor(partial: Partial<ExpenseByCategoryItemDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  categoryId: Types.ObjectId;

  @Expose()
  categoryName?: string;

  @Expose()
  total: number;
}

@Exclude()
export class ExpensesByCategoryResponseDto {
  constructor(partial: Partial<ExpensesByCategoryResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => ExpenseByCategoryItemDto)
  data: ExpenseByCategoryItemDto[];
}
