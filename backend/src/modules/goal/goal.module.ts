import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Goal, GoalSchema } from "./schemas";
import { GoalRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
  ],

  providers: [GoalRepository],
  exports: [],
})
export class GoalModule {}