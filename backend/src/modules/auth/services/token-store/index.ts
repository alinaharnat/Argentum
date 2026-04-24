import { Injectable } from "@nestjs/common";
import { HashService } from "../../../common/services";
import { RefreshTokenRepository } from "../../repository";
import { RefreshToken } from "../../schemas";
import { SaveRefreshTokenParams } from "./types";
import { Types } from "mongoose";

@Injectable()
export class TokenStoreService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly hashService: HashService,
  ) {}

  public async saveRefreshToken({
    userId,
    refreshToken,
  }: SaveRefreshTokenParams): Promise<RefreshToken> {
    const { jti, token, expiresAt } = refreshToken;

    const tokenHash = await this.hashService.hash(token);

    return this.refreshTokenRepository.create({
      jti,
      userId,
      tokenHash,
      expiresAt,
    });
  }

  public async removeRefreshToken(
    refreshTokenId: Types.ObjectId,
  ): Promise<boolean> {
    const deletedDoc = await this.refreshTokenRepository.delete({
      filter: { id: { eq: refreshTokenId } },
    });

    return !!deletedDoc;
  }

  public findRefreshToken(tokenJti: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.get({
      jti: { eq: tokenJti },
    });
  }
}
