import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Account, AccountSchema } from "./schemas";
import { AccountRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],

  providers: [AccountRepository],
  exports: [],
})
export class AccountModule {}