import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import { EnvironmentVariables } from "../validation/validation-schema";
import { EnvKey } from "../enums";

@Injectable()
export class EnvService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  get port(): number {
    return this.getValueFromEnv(EnvKey.Port);
  }

  get frontendUrl(): string {
    return this.getValueFromEnv(EnvKey.FrontendUrl);
  }

  get mongoDbUrl(): string {
    return this.getValueFromEnv(EnvKey.MongoDbUrl);
  }

  get jwtAccessSecret(): string {
    return this.getValueFromEnv(EnvKey.JwtAccessSecret);
  }

  get jwtAccessExpiresInMinutes(): number {
    return this.getValueFromEnv(EnvKey.JwtAccessExpiresInMinutes);
  }

  get jwtRefreshSecret(): string {
    return this.getValueFromEnv(EnvKey.JwtRefreshSecret);
  }

  get jwtRefreshExpiresInMinutes(): number {
    return this.getValueFromEnv(EnvKey.JwtRefreshExpiresInMinutes);
  }

  private getValueFromEnv<K extends keyof EnvironmentVariables>(
    key: K,
  ): EnvironmentVariables[K] {
    return this.configService.get(key, { infer: true });
  }
}
