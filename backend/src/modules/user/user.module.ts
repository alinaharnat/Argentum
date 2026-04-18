import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas";
import { UserRepository } from "./repositories";
import { UserService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],

  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
