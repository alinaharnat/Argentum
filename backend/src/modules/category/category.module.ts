import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Category, CategorySchema } from "./schemas";
import { CategoryRepository } from "./repositories";
import { CategoryService } from "./services";
import { CategoryController } from "./controllers";
import { CategorySeedService } from "./services/category-seed.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
  ],

  controllers: [CategoryController],
  providers: [CategoryRepository, CategoryService, CategorySeedService],
  exports: [CategoryService],
})
export class CategoryModule {}
