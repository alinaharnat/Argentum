import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "notifications",
  id: false,
})
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ["BUDGET_EXCEEDED", "GOAL_PROGRESS", "SYSTEM"] })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);