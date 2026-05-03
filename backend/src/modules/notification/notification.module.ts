import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Notification, NotificationSchema } from "./schemas";
import { NotificationRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],

  providers: [NotificationRepository],
  exports: [],
})
export class NotificationModule {}