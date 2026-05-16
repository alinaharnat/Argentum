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
import { IconName } from "../../enums";

export class CreateCategoryRequestDto {
  @IsString()
  @IsNotEmpty({ message: "Name should not be empty" })
  @Length(1, 50, { message: "Name must be between 1 and 50 characters" })
  @Transform(({ value }) => value?.trim().toLowerCase())
  name: string;

  @IsEnum(CategoryType, {
    message: `Type must be either ${CategoryType.Income} or ${CategoryType.Expense}`,
  })
  type: CategoryType;

  @IsEnum(IconName)
  @IsOptional()
  @IsNotEmpty()
  icon: IconName = IconName.Folder;

  @IsHexColor({ message: "Color must be a valid HEX string (e.g., #000000)" })
  @IsOptional()
  color: string = "#000000";
}
