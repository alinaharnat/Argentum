import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { Request } from "express";
import { EnvService } from "../../env/services";
import type { IRefreshTokenPayload } from "../types";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(envService: EnvService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies?.refreshToken;
      },
      ignoreExpiration: false,
      secretOrKey: envService.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IRefreshTokenPayload) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    return {
      userId: payload.sub,
      refreshTokenId: payload.refreshTokenId,
      refreshToken,
    };
  }
}
