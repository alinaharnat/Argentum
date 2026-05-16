import { Transform } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { SortOrder } from "../../../common/enums";
import { GoalField, GoalStatus } from "../../enums";

export class GetUserGoalsRequestQueryDto {
  @IsOptional()
  @IsEnum(GoalStatus)
  @Transform(({ value }) =>
    typeof value === "string" ? value.trim().toUpperCase() : value,
  )
  status?: GoalStatus;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Target date from must be a valid date" })
  targetDateFrom?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Target date to must be a valid date" })
  targetDateTo?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Created from must be a valid date" })
  createdFrom?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate({ message: "Created to must be a valid date" })
  createdTo?: Date;

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
  @IsEnum(GoalField)
  sortBy: GoalField = GoalField.CreatedAt;

  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => Number(value))
  sortOrder: SortOrder = SortOrder.Descending;
}
