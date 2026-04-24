import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type UserDocument = HydratedDocument<User>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "users",
  id: false,
})
export class User {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, alias: "password_hash" })
  passwordHash: string;

  @Prop({ trim: true, alias: "first_name" })
  firstName?: string;

  @Prop({ trim: true, alias: "last_name" })
  lastName?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
