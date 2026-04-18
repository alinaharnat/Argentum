import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";

export type UserDocument = HydratedDocument<User>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "users",
})
export class User {
  @Prop({
    type: Types.ObjectId,
    alias: "id",
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true, alias: "passwordHash" })
  password_hash: string;

  @Prop({ trim: true, alias: "firstName" })
  first_name?: string;

  @Prop({ trim: true, alias: "lastName" })
  last_name?: string;

  @Prop({ default: 0, alias: "loginAttempts" })
  login_attempts: number;

  @Prop({ alias: "lockUntil" })
  lock_until?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
