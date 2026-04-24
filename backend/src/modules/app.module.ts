import { Module } from "@nestjs/common";
import { EnvModule } from "./env/env.module";
import { DatabaseModule } from "./database/database.module";
import { CommonModule } from "./common/common.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ThrottlerModule } from "@nestjs/throttler/dist/throttler.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    EnvModule,
    DatabaseModule,
    CommonModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
