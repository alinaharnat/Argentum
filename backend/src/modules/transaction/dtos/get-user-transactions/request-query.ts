import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Types } from "mongoose";
import { SortOrder } from "../../../common/enums";
import { TransactionField, TransactionType } from "../../enums";

export class GetUserTransactionsRequestQueryDto {
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  categoryId?: Types.ObjectId;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Date from must be a valid date" })
  dateFrom?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Date to must be a valid date" })
  dateTo?: Date;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Amount min must be a number" })
  amountMin?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Amount max must be a number" })
  amountMax?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Limit must be a number" })
  @Min(0)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: "Offset must be a number" })
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  @IsEnum(TransactionField)
  sortBy: TransactionField = TransactionField.Date;

  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => Number(value))
  sortOrder: SortOrder = SortOrder.Descending;
}
