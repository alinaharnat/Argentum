import { Injectable } from "@nestjs/common";
import { HashService } from "../../../common/services";
import { TokenGenerationService } from "../token-generation";
import { TokenStoreService } from "../token-store";
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";
import { ILoginResult } from "../auth/types";

@Injectable()
export class SessionService {
  constructor(
    private readonly hashService: HashService,
    private readonly tokenGenerationService: TokenGenerationService,
    private readonly tokenStoreService: TokenStoreService,
  ) {}

  public refreshSession(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<string | undefined> {
    return this.refreshAccessToken(userId, refreshToken);
  }

  public async createSession(userId: Types.ObjectId): Promise<ILoginResult> {
    const refreshTokenId = randomUUID();

    const { accessToken, refreshToken } =
      await this.tokenGenerationService.generateAuthTokens({
        userId,
        refreshTokenId,
      });

    await this.tokenStoreService.saveRefreshToken({
      userId,
      refreshToken: {
        jti: refreshTokenId,
        token: refreshToken.token,
        expiresAt: refreshToken.expiresAt,
      },
    });

    return { accessToken, refreshToken: refreshToken.token };
  }

  public async removeSession(refreshToken: string): Promise<boolean> {
    const tokenJti =
      await this.tokenGenerationService.getRefreshTokenJti(refreshToken);

    const refreshTokenFromDb =
      await this.tokenStoreService.findRefreshToken(tokenJti);

    if (!refreshTokenFromDb) {
      return false;
    }

    return this.tokenStoreService.removeRefreshToken(refreshTokenFromDb.id);
  }

  private async refreshAccessToken(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<string | undefined> {
    const refreshTokenJti =
      await this.tokenGenerationService.getRefreshTokenJti(refreshToken);

    const refreshTokenFromDb =
      await this.tokenStoreService.findRefreshToken(refreshTokenJti);

    if (!refreshTokenFromDb) {
      return;
    }

    const isTokenValid = await this.hashService.compare(
      refreshToken,
      refreshTokenFromDb.tokenHash,
    );

    if (!isTokenValid) {
      return;
    }

    return this.tokenGenerationService.generateAccessToken({ userId });
  }
}
