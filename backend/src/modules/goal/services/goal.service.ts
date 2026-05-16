import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GoalRepository } from "../repositories";
import { Goal } from "../schemas";
import { GoalStatus } from "../enums";
import {
  ICreateGoalParams,
  IDeleteGoalParams,
  IGetGoalByIdParams,
  IGetUserGoalsParams,
  IUpdateGoalParams,
} from "./types";

@Injectable()
export class GoalService {
  constructor(private readonly goalRepository: GoalRepository) {}

  public async createGoal(params: ICreateGoalParams): Promise<Goal> {
    const currentAmount = params.currentAmount ?? 0;
    const targetAmount = params.targetAmount;
    const status = this.resolveGoalStatus({
      currentAmount,
      targetAmount,
    });

    return this.goalRepository.create({
      ...params,
      currentAmount,
      currency: this.normalizeCurrency(params.currency),
      status,
    });
  }

  public async updateGoal(params: IUpdateGoalParams): Promise<Goal> {
    const { _id, userId, ...dataForUpdate } = params;

    if (!this.validateDataForUpdate(dataForUpdate)) {
      throw new BadRequestException("No data provided for update");
    }

    const existingGoal = await this.goalRepository.get({
      _id: { eq: _id },
      userId: { eq: userId },
    });

    if (!existingGoal) {
      throw new ForbiddenException("User does not own this goal");
    }

    const nextCurrentAmount =
      dataForUpdate.currentAmount ?? existingGoal.currentAmount;
    const nextTargetAmount =
      dataForUpdate.targetAmount ?? existingGoal.targetAmount;
    const nextStatus = this.resolveGoalStatus({
      currentAmount: nextCurrentAmount,
      targetAmount: nextTargetAmount,
      existingStatus: existingGoal.status,
    });

    const updatePayload: Record<string, any> = {
      ...dataForUpdate,
      status: nextStatus,
    };

    if (dataForUpdate.currency !== undefined) {
      updatePayload.currency = this.normalizeCurrency(dataForUpdate.currency);
    }

    const updatedGoal = await this.goalRepository.update(
      {
        filter: {
          _id: { eq: _id },
          userId: { eq: userId },
        },
      },
      updatePayload,
    );

    if (!updatedGoal) {
      throw new NotFoundException("Goal not found");
    }

    return updatedGoal;
  }

  public async getGoalById({ _id, userId }: IGetGoalByIdParams): Promise<Goal> {
    const isOwner = await this.validateGoalOwnership({ _id, userId });

    if (!isOwner) {
      throw new ForbiddenException("User does not own this goal");
    }

    const goal = await this.goalRepository.get({
      _id: { eq: _id },
      userId: { eq: userId },
    });

    if (!goal) {
      throw new NotFoundException("Goal not found");
    }

    return goal;
  }

  public async getUserGoals(params: IGetUserGoalsParams): Promise<Goal[]> {
    return this.goalRepository.getGoals(params);
  }

  public async deleteGoal({ _id, userId }: IDeleteGoalParams): Promise<Goal> {
    const isOwner = await this.validateGoalOwnership({ _id, userId });

    if (!isOwner) {
      throw new ForbiddenException("User does not own this goal");
    }

    const goal = await this.goalRepository.update(
      {
        filter: {
          _id: { eq: _id },
          userId: { eq: userId },
        },
      },
      {
        status: GoalStatus.Cancelled,
      },
    );

    if (!goal) {
      throw new NotFoundException("Goal not found");
    }

    return goal;
  }

  private async validateGoalOwnership({
    _id,
    userId,
  }: IGetGoalByIdParams): Promise<boolean> {
    const goal = await this.goalRepository.get({
      _id: { eq: _id },
      userId: { eq: userId },
    });

    return !!goal;
  }

  private validateDataForUpdate(
    data: Partial<Omit<IUpdateGoalParams, "_id" | "userId">>,
  ): boolean {
    return Object.values(data).some((value) => value !== undefined);
  }

  private resolveGoalStatus(params: {
    currentAmount: number;
    targetAmount: number;
    existingStatus?: GoalStatus;
  }): GoalStatus {
    if (params.existingStatus === GoalStatus.Cancelled) {
      return GoalStatus.Cancelled;
    }

    return params.currentAmount >= params.targetAmount
      ? GoalStatus.Completed
      : GoalStatus.Active;
  }

  private normalizeCurrency(currency?: string): string {
    const normalizedCurrency = currency?.trim().toUpperCase();

    return normalizedCurrency || "UAH";
  }
}
