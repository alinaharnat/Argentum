import { IsNumber, IsOptional, Min } from "class-validator";

export class UpdateBudgetRequestBodyDto {
  @IsOptional()
  @IsNumber({}, { message: "Amount limit must be a number" })
  @Min(0.01, { message: "Amount limit must be greater than 0" })
  amountLimit?: number;
}
