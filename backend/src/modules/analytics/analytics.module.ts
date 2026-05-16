import { Module } from "@nestjs/common";
import { CategoryModule } from "../category/category.module";
import { TransactionModule } from "../transaction/transaction.module";
import { AnalyticsController } from "./controllers";
import { AnalyticsService } from "./services";

@Module({
  imports: [CategoryModule, TransactionModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
