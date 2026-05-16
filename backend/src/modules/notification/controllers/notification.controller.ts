import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AccessTokenGuard } from "../../auth/guards";
import { CurrentUserId } from "../../common/decorators";
import { NotificationService } from "../services";
import {
  GetNotificationsRequestQueryDto,
  GetNotificationsResponseDto,
  NotificationResponseDto,
} from "../dtos";

@UseGuards(AccessTokenGuard)
@Controller("notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  public async getNotifications(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetNotificationsRequestQueryDto,
  ): Promise<GetNotificationsResponseDto> {
    const data = await this.notificationService.getUserNotifications({
      userId,
      type: query.type,
      limit: query.limit,
      offset: query.offset,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    return new GetNotificationsResponseDto({
      data: data.map((item) => new NotificationResponseDto(item)),
    });
  }
}
