import { Transform } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { SortOrder } from "../../../common/enums";
import { NotificationField, NotificationType } from "../../enums";

export class GetNotificationsRequestQueryDto {
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

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
  @IsEnum(NotificationField)
  sortBy: NotificationField = NotificationField.CreatedAt;

  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => Number(value))
  sortOrder: SortOrder = SortOrder.Descending;
}
