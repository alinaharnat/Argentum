import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Category } from "../schemas";

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {
    super(categoryModel);
  }
}
