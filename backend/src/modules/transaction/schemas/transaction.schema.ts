import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";
import { TransactionType } from "../enums";

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "transactions",
  id: false,
})
export class Transaction {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Account", required: true })
  accountId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Category", required: true })
  categoryId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: TransactionType, type: String })
  type: TransactionType;

  @Prop({ default: Date.now })
  date: Date;

  @Prop({ trim: true })
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
