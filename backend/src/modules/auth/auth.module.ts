import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { AuthService } from "./services";
import { TokenStoreService } from "./services";
import { TokenGenerationService } from "./services";
import { SessionService } from "./services";
import { AuthController } from "./controllers";
import { RefreshTokenRepository } from "./repository";
import { RefreshToken, RefreshTokenSchema } from "./schemas";
import { CommonModule } from "../common/common.module";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose/dist/mongoose.module";
import { AccessTokenGuard } from "./guards";
import { JwtStrategy } from "./starategies/access";
import { RefreshTokenStrategy } from "./starategies/refresh";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.register({}),
    UserModule,
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenGenerationService,
    TokenStoreService,
    SessionService,
    RefreshTokenRepository,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
