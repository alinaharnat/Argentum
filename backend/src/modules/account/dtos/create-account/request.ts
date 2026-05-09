import { Transform } from "class-transformer";
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsOptional,
  MaxLength,
  Length,
} from "class-validator";

export const ACCOUNT_TYPES = ["CASH", "BANK", "SAVINGS"] as const;

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn(ACCOUNT_TYPES, {
    message: "Invalid account type. Allowed types are: CASH, BANK, SAVINGS",
  })
  type: (typeof ACCOUNT_TYPES)[number];

  @IsNumber({}, { message: "Invalid balance. Balance must be a number" })
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.toUpperCase())
  @Length(3, 3, {
    message:
      "Invalid currency code. Currency code must be exactly 3 characters long",
  })
  currency?: string;
}
