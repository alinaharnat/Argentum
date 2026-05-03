import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Notification } from "../schemas";

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<Notification>) {
    super(notificationModel);
  }
}
