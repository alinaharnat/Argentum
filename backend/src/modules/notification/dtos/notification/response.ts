import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Types } from "mongoose";
import { NotificationType } from "../../enums";

@Exclude()
export class NotificationResponseDto {
  constructor(partial: Partial<NotificationResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  _id: Types.ObjectId;

  @Expose()
  type: NotificationType;

  @Expose()
  message: string;

  @Expose()
  isRead: boolean;

  @Expose()
  @Type(() => Date)
  createdAt: Date;
}
