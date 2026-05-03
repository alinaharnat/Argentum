import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schemas";
import { CategoryRepository } from "./repositories";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],

  providers: [CategoryRepository],
  exports: [],
})
export class CategoryModule {}