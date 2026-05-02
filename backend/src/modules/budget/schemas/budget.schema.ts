import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type BudgetDocument = HydratedDocument<Budget>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "budgets",
  id: false,
})
export class Budget {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  amountLimit: number;

  @Prop({ required: true }) // Формат "YYYY-MM"
  period: string;

  createdAt: Date;
  updatedAt: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);