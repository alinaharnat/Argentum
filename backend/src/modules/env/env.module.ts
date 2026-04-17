import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvService } from "./services";
import { validateEnv } from "./validation";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv,
    }),
  ],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
