import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Budget, BudgetSchema } from "./schemas";
import { BudgetRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],

  providers: [BudgetRepository],
  exports: [],
})
export class BudgetModule {}