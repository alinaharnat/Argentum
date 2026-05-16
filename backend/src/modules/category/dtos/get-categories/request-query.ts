import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { CategoryType, CategoryScope } from "../../enums";

export class GetCategoriesRequestQueryDto {
  @IsOptional()
  @IsEnum(CategoryType)
  type?: CategoryType;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(CategoryScope)
  scope?: CategoryScope = CategoryScope.All;
}
