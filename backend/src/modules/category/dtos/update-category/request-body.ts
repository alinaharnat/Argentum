import {
  IsString,
  IsOptional,
  IsEnum,
  IsHexColor,
  Length,
  IsNotEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { CategoryType } from "../../enums/category-types";

export class UpdateCategoryRequestBodyDto {
  @IsString()
  @IsOptional()
  @Length(1, 50, { message: "Name must be between 1 and 50 characters" })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEnum(CategoryType, {
    message: `Type must be either ${CategoryType.Income} or ${CategoryType.Expense}`,
  })
  @IsOptional()
  type: CategoryType;

  @IsString()
  @IsOptional()
  icon: string;

  @IsHexColor({ message: "Color must be a valid HEX string (e.g., #000000)" })
  @IsOptional()
  color: string;
}
