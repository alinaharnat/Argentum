import { Transform } from "class-transformer";
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class CreateGoalRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  description?: string;

  @IsNumber({}, { message: "Target amount must be a number" })
  @Min(0.01, { message: "Target amount must be greater than 0" })
  @Max(1000000000000, { message: "Target amount is too large" })
  @Transform(({ value }) => Number(value))
  targetAmount: number;

  @IsOptional()
  @IsNumber({}, { message: "Current amount must be a number" })
  @Min(0, { message: "Current amount must be greater than or equal to 0" })
  @Max(1000000000000, { message: "Current amount is too large" })
  @Transform(({ value }) => Number(value))
  currentAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toUpperCase() : value,
  )
  currency?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Target date must be a valid date" })
  targetDate?: Date;
}
