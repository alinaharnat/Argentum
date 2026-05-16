import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Goal, GoalSchema } from "./schemas";
import { GoalRepository } from "./repositories";
import { GoalController } from "./controllers";
import { GoalService } from "./services";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],

  controllers: [GoalController],
  providers: [GoalRepository, GoalService],
  exports: [GoalRepository, GoalService],
})
export class GoalModule {}
