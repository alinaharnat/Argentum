import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type GoalDocument = HydratedDocument<Goal>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "goals",
  id: false,
})
export class Goal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop({ required: false })
  deadline: Date;

  @Prop({ required: true, enum: ["ACTIVE", "COMPLETED"], default: "ACTIVE" })
  status: string;

  createdAt: Date;
  updatedAt: Date;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);