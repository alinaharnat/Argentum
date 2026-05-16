import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "./schemas";
import { TransactionRepository } from "./repositories";
import { TransactionService } from "./services";
import { TransactionController } from "./controllers";
import { AccountModule } from "../account/account.module";
import { CategoryModule } from "../category/category.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    AccountModule,
    CategoryModule,
  ],

  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionRepository, TransactionService],
})
export class TransactionModule {}
