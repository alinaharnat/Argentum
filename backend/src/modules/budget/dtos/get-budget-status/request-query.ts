import { Transform } from "class-transformer";
import { IsOptional, IsString, Matches } from "class-validator";
import { Types } from "mongoose";

export class GetBudgetStatusRequestQueryDto {
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, {
    message: "Period must be in YYYY-MM format",
  })
  period?: string;
}
