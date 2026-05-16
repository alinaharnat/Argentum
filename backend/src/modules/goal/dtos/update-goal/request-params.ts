import { IsMongoId, IsString } from "class-validator";

export class UpdateGoalRequestParamsDto {
  @IsString()
  @IsMongoId({ message: "Goal id must be a valid MongoDB ObjectId" })
  id: string;
}
