import { Exclude, Expose, Type } from "class-transformer";
import { NotificationResponseDto } from "../notification";

@Exclude()
export class GetNotificationsResponseDto {
  constructor(partial: Partial<GetNotificationsResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => NotificationResponseDto)
  data: NotificationResponseDto[];
}
