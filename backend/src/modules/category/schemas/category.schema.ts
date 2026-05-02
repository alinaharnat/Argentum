import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "categories",
  id: false,
})
export class Category {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null }) // null для системних категорій
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: ["INCOME", "EXPENSE"] })
  type: string;

  @Prop({ default: "folder" }) // Назва іконки
  icon: string;

  @Prop({ default: "#000000" })
  color: string;

  createdAt: Date;
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);