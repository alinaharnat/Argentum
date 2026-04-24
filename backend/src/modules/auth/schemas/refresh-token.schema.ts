import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { DEFAULT_SCHEMA_OPTIONS } from "../../database/default-schema.config";
import { User } from "../../user/schemas";

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
  ...DEFAULT_SCHEMA_OPTIONS,
  collection: "refresh_tokens",
})
export class RefreshToken {
  @Prop({
    type: Types.ObjectId,
    name: "_id",
    default: () => new Types.ObjectId(),
  })
  id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
    name: "user_id",
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    name: "token_hash",
  })
  tokenHash: string;

  @Prop({
    required: true,
    name: "jti",
  })
  jti: string;

  @Prop({
    required: true,
    name: "expires_at",
  })
  expiresAt: Date;

  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
