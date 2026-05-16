import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator";
import { Types } from "mongoose";

export class CreateBudgetRequestDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId: Types.ObjectId;

  @IsNumber({}, { message: "Amount limit must be a number" })
  @Min(0.01, { message: "Amount limit must be greater than 0" })
  @Transform(({ value }) => parseFloat(value))
  amountLimit: number;

  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: "Period must be in YYYY-MM format",
  })
  period: string;
}
