import { Exclude, Expose } from "class-transformer";

@Exclude()
export class SummaryResponseDto {
  constructor(partial: Partial<SummaryResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  totalIncome: number;

  @Expose()
  totalExpenses: number;

  @Expose()
  balance: number;
}
