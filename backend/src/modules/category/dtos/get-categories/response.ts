import { Exclude, Expose, Type } from "class-transformer";
import { CategoryResponseDto } from "../category/response";

@Exclude()
export class GetCategoriesResponseDto {
  constructor(partial: Partial<GetCategoriesResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => CategoryResponseDto)
  data: CategoryResponseDto[];
}
