import { Module } from "@nestjs/common";
import { EnvModule } from "./env/env.module";
import { DatabaseModule } from "./database/database.module";
import { CommonModule } from "./common/common.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [EnvModule, DatabaseModule, CommonModule, UserModule],
})
export class AppModule {}
