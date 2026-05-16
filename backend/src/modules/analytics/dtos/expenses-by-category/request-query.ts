import { Transform } from "class-transformer";
import { IsDate, IsOptional, IsString, Matches } from "class-validator";

export class GetExpensesByCategoryRequestQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: "Period must be in YYYY-MM format" })
  period?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "From must be a valid date" })
  from?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "To must be a valid date" })
  to?: Date;
}
