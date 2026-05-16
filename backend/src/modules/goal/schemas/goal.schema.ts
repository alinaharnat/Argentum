import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";
import { GoalStatus } from "../enums";

export type GoalDocument = HydratedDocument<Goal>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "goals",
  id: false,
})
export class Goal {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: false, trim: true })
  description?: string;

  @Prop({ required: true, min: 0.01 })
  targetAmount: number;

  @Prop({ default: 0, min: 0 })
  currentAmount: number;

  @Prop({ default: "UAH" })
  currency: string;

  @Prop({ required: false })
  targetDate?: Date;

  @Prop({ required: true, enum: GoalStatus, default: GoalStatus.Active })
  status: GoalStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);

GoalSchema.index({ userId: 1, status: 1, createdAt: -1 });
GoalSchema.index({ userId: 1, targetDate: 1 });
