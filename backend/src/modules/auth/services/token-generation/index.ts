import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EnvService } from "../../../env/services";

import type { IAccessTokenPayload, IRefreshTokenPayload } from "../../types";
import {
  IGenerateAuthTokensParams,
  IGenerateAuthTokensResult,
  IGenerateAccessTokenParams,
  TGenerateTokenPayload,
} from "./types";

enum TokenType {
  Access = "ACCESS",
  Refresh = "REFRESH",
}

const TOKEN_CONFIG = {
  [TokenType.Access]: {
    getSecret: (env: EnvService) => env.jwtAccessSecret,
    getExpiresIn: (env: EnvService) => env.jwtAccessExpiresInMinutes,
  },
  [TokenType.Refresh]: {
    getSecret: (env: EnvService) => env.jwtRefreshSecret,
    getExpiresIn: (env: EnvService) => env.jwtRefreshExpiresInMinutes,
  },
};

@Injectable()
export class TokenGenerationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  public async generateAuthTokens({
    userId,
    refreshTokenId,
  }: IGenerateAuthTokensParams): Promise<IGenerateAuthTokensResult> {
    const accessPayload: IAccessTokenPayload = { sub: userId };
    const refreshPayload: IRefreshTokenPayload = {
      sub: userId,
      refreshTokenId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(accessPayload, TokenType.Access),
      this.generateToken(refreshPayload, TokenType.Refresh),
    ]);

    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt(refreshToken);

    return {
      accessToken,
      refreshToken: { token: refreshToken, expiresAt: refreshTokenExpiresAt },
    };
  }

  public generateAccessToken({
    userId,
  }: IGenerateAccessTokenParams): Promise<string> {
    const payload: IAccessTokenPayload = { sub: userId };

    return this.generateToken(payload, TokenType.Access);
  }

  public async getRefreshTokenJti(refreshToken: string): Promise<string> {
    const payload = this.jwtService.decode(refreshToken);

    return payload?.refreshTokenId;
  }

  private generateToken(
    payload: TGenerateTokenPayload,
    type: TokenType,
  ): Promise<string> {
    const tokenConfig = TOKEN_CONFIG[type];

    const expiresInSeconds = tokenConfig.getExpiresIn(this.envService) * 60;

    return this.jwtService.signAsync(payload, {
      secret: tokenConfig.getSecret(this.envService),
      expiresIn: expiresInSeconds,
    });
  }

  private getRefreshTokenExpiresAt(refreshToken: string): Date {
    const decodedToken = this.jwtService.decode(refreshToken);
    const expiresAtMilliseconds = decodedToken.exp * 1000;
    return new Date(expiresAtMilliseconds);
  }
}
