import { IsMongoId, IsString } from "class-validator";

export class GetGoalByIdRequestDto {
  @IsString()
  @IsMongoId({ message: "Goal id must be a valid MongoDB ObjectId" })
  id: string;
}
