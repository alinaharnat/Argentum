import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { RefreshToken } from "../schemas";

@Injectable()
export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {
    super(refreshTokenModel);
  }
}
