import { IsNumber, IsString } from "class-validator";
import { EnvKey } from "../enums";

export class EnvironmentVariables {
  @IsNumber()
  [EnvKey.Port]: number;

  @IsString()
  [EnvKey.MongoDbUrl]: string;

  @IsString()
  [EnvKey.FrontendUrl]: string;

  @IsString()
  [EnvKey.JwtAccessSecret]: string;

  @IsNumber()
  [EnvKey.JwtAccessExpiresInMinutes]: number;

  @IsString()
  [EnvKey.JwtRefreshSecret]: string;

  @IsNumber()
  [EnvKey.JwtRefreshExpiresInMinutes]: number;
}
