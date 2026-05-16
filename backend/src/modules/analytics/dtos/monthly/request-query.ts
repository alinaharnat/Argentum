import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class GetMonthlyStatsRequestQueryDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Year must be a number" })
  year?: number;
}
