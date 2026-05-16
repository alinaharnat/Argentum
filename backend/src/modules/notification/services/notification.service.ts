import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { NotificationRepository } from "../repositories";
import { Notification } from "../schemas";
import { NotificationType } from "../enums";
import { TFilter } from "../../database/types";

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async getUserNotifications(params: {
    userId: Types.ObjectId;
    type?: NotificationType;
    limit?: number;
    offset?: number;
    sortBy: string;
    sortOrder: 1 | -1;
  }): Promise<Notification[]> {
    const filter: TFilter<Notification> = {
      userId: { eq: params.userId },
    };

    if (params.type) {
      filter.type = { eq: params.type } as any;
    }

    return this.notificationRepository.getMany({
      filter,
      sort: { [params.sortBy]: params.sortOrder },
      pagination: { limit: params.limit, offset: params.offset },
    });
  }

  public async createBudgetExceededNotification(params: {
    userId: Types.ObjectId;
    categoryId: Types.ObjectId;
    period: string;
    amountLimit: number;
    spent: number;
  }): Promise<void> {
    const message = `Budget exceeded for category ${params.categoryId} in ${params.period}. Limit: ${params.amountLimit}, spent: ${params.spent}`;

    const existing = await this.notificationRepository.get({
      userId: { eq: params.userId },
      type: { eq: NotificationType.BudgetExceeded },
      message: { eq: message },
      isRead: { eq: false },
    });

    if (existing) {
      return;
    }

    await this.notificationRepository.create({
      userId: params.userId,
      type: NotificationType.BudgetExceeded,
      message,
      isRead: false,
    });
  }
}
