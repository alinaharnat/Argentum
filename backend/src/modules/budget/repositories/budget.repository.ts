import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Budget } from "../schemas";

@Injectable()
export class BudgetRepository extends BaseRepository<Budget> {
  constructor(@InjectModel(Budget.name) private readonly budgetModel: Model<Budget>) {
    super(budgetModel);
  }
}
