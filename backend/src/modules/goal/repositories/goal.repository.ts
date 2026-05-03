import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Goal } from "../schemas";

@Injectable()
export class GoalRepository extends BaseRepository<Goal> {
  constructor(@InjectModel(Goal.name) private readonly goalModel: Model<Goal>) {
    super(goalModel);
  }
}
