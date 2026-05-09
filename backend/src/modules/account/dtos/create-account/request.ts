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
import { AccountType } from "../../enums";

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn([AccountType.Cash, AccountType.Bank, AccountType.Savings], {
    message: `Invalid account type. Allowed: ${Object.values(AccountType).join(", ")}`,
  })
  type: AccountType;

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
