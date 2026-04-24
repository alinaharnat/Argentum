import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EnvService } from "../../env/services";
import type { IAccessTokenPayload } from "../types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt-access") {
  constructor(private readonly envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtAccessSecret,
    });
  }

  validate(payload: IAccessTokenPayload) {
    if (!payload.sub) {
      throw new UnauthorizedException("Invalid token payload");
    }

    return {
      userId: payload.sub,
    };
  }
}
