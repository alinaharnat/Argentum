import { Exclude, Expose, Transform } from "class-transformer";
import { CategoryType, CategoryScope } from "../../enums";
import { Types } from "mongoose";

@Exclude()
export class CategoryResponseDto {
  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  _id: Types.ObjectId;

  @Expose()
  name: string;

  @Expose()
  type: CategoryType;

  @Expose()
  icon: string;

  @Expose()
  color: string;

  @Expose()
  isDeleted: boolean;

  @Expose()
  scope: CategoryScope;
}
