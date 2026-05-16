import { Exclude, Expose, Type } from "class-transformer";
import { GoalResponseDto } from "../goal";

@Exclude()
export class GetUserGoalsResponseDto {
  constructor(partial: Partial<GetUserGoalsResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => GoalResponseDto)
  data: GoalResponseDto[];
}
