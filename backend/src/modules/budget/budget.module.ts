import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Budget, BudgetSchema } from "./schemas";
import { BudgetRepository } from "./repositories";
import { BudgetService } from "./services";
import { BudgetController } from "./controllers";
import { CategoryModule } from "../category/category.module";
import { TransactionModule } from "../transaction/transaction.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Budget.name, schema: BudgetSchema }]),
    CategoryModule,
    TransactionModule,
    NotificationModule,
  ],

  controllers: [BudgetController],
  providers: [BudgetRepository, BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
