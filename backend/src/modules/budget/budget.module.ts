import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Budget, BudgetSchema } from "./schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class BudgetModule {}