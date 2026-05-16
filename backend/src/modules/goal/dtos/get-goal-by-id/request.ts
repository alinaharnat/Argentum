import { IsMongoId, IsString } from "class-validator";

export class GetGoalByIdRequestDto {
  @IsString()
  id: string;
}
