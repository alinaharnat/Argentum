import { Exclude, Expose } from "class-transformer";

@Exclude()
export class MonthlyStatItemDto {
  constructor(partial: Partial<MonthlyStatItemDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  month: number;

  @Expose()
  income: number;

  @Expose()
  expense: number;

  @Expose()
  balance: number;
}

@Exclude()
export class GetMonthlyStatsResponseDto {
  constructor(partial: Partial<GetMonthlyStatsResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  data: MonthlyStatItemDto[];
}
