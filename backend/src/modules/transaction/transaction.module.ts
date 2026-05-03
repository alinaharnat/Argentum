import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Transaction, TransactionSchema } from "./schemas";
import { TransactionRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],

  providers: [TransactionRepository],
  exports: [],
})
export class TransactionModule {}