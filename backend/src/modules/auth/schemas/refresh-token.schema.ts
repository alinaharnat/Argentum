import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";
import { User } from "../../user/schemas";

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "refresh_tokens",
  id: false,
})
export class RefreshToken {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    alias: "user_id",
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    alias: "token_hash",
  })
  tokenHash: string;

  @Prop({
    required: true,
  })
  jti: string;

  @Prop({
    required: true,
    alias: "expires_at",
  })
  expiresAt: Date;

  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
