import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Goal } from "../schemas";
import { IGetUserGoalsParams } from "../services/types";
import { TFilter } from "../../database/types";

@Injectable()
export class GoalRepository extends BaseRepository<Goal> {
  constructor(@InjectModel(Goal.name) private readonly goalModel: Model<Goal>) {
    super(goalModel);
  }

  public async getGoals({
    userId,
    query,
  }: IGetUserGoalsParams): Promise<Goal[]> {
    const filter: TFilter<Goal> = {
      userId: { eq: userId },
    };

    if (query.status) {
      filter.status = { eq: query.status } as any;
    }

    if (query.targetDateFrom || query.targetDateTo) {
      filter.targetDate = {} as any;

      if (query.targetDateFrom) {
        filter.targetDate.gte = query.targetDateFrom;
      }

      if (query.targetDateTo) {
        filter.targetDate.lte = query.targetDateTo;
      }
    }

    if (query.createdFrom || query.createdTo) {
      filter.createdAt = {} as any;

      if (query.createdFrom) {
        filter.createdAt.gte = query.createdFrom;
      }

      if (query.createdTo) {
        filter.createdAt.lte = query.createdTo;
      }
    }

    return this.getMany({
      filter,
      sort: { [query.sortBy]: query.sortOrder },
      pagination: {
        limit: query.limit,
        offset: query.offset,
      },
    });
  }
}
