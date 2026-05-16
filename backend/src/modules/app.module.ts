import { Module } from "@nestjs/common";
import { EnvModule } from "./env/env.module";
import { DatabaseModule } from "./database/database.module";
import { CommonModule } from "./common/common.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { AccountModule } from "./account/account.module";
import { ThrottlerModule } from "@nestjs/throttler/dist/throttler.module";
import { CategoryModule } from "./category/category.module";
import { TransactionModule } from "./transaction/transaction.module";
import { BudgetModule } from "./budget/budget.module";
import { NotificationModule } from "./notification/notification.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { GoalModule } from "./goal/goal.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 5,
      },
    ]),
    EnvModule,
    DatabaseModule,
    CommonModule,
    UserModule,
    AuthModule,
    AccountModule,
    CategoryModule,
    TransactionModule,
    BudgetModule,
    NotificationModule,
    GoalModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
