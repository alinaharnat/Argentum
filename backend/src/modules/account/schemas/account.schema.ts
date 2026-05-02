import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type AccountDocument = HydratedDocument<Account>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "accounts",
  id: false,
})
export class Account {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ["CASH", "BANK", "SAVINGS"] })
  type: string;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ default: "UAH" })
  currency: string;

  createdAt: Date;
  updatedAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);