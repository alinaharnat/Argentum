import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { Types } from "mongoose";
import { TransactionType } from "../../enums";

export class CreateTransactionRequestDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  accountId: Types.ObjectId;

  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId: Types.ObjectId;

  @IsNumber({}, { message: "Amount must be a number" })
  @Min(0.01, { message: "Amount must be greater than 0" })
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Date must be a valid date" })
  date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
