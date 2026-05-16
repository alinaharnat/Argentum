import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BudgetRepository } from "../repositories";
import { Budget } from "../schemas";
import { CategoryService } from "../../category/services/category.service";
import { TransactionRepository } from "../../transaction/repositories";
import {
  ICreateBudgetParams,
  IGetBudgetStatusParams,
  IUpdateBudgetParams,
} from "./types";
import { CategoryType } from "../../category/enums";
import { NotificationService } from "../../notification/services/notification.service";

@Injectable()
export class BudgetService {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly categoryService: CategoryService,
    private readonly transactionRepository: TransactionRepository,
    private readonly notificationService: NotificationService,
  ) {}

  public async createBudget(params: ICreateBudgetParams): Promise<Budget> {
    const { userId, categoryId, period } = params;

    const category = await this.categoryService.getCategoryById({
      _id: categoryId,
      userId,
    });

    if (category.type !== CategoryType.Expense) {
      throw new BadRequestException("Budgets can only be set for expenses");
    }

    const existing = await this.budgetRepository.get({
      userId: { eq: userId },
      categoryId: { eq: categoryId },
      period: { eq: period },
    });

    if (existing) {
      throw new BadRequestException("Budget already exists for this period");
    }

    return this.budgetRepository.create(params);
  }

  public async updateBudget(params: IUpdateBudgetParams): Promise<Budget> {
    const { _id, userId, ...dataForUpdate } = params;

    if (!this.validateDataForUpdate(dataForUpdate)) {
      throw new BadRequestException("No data provided for update");
    }

    const updated = await this.budgetRepository.update(
      { filter: { _id: { eq: _id }, userId: { eq: userId } } as any },
      dataForUpdate,
    );

    if (!updated) {
      throw new NotFoundException("Budget not found");
    }

    return updated;
  }

  public async getBudgetStatus(params: IGetBudgetStatusParams): Promise<
    Array<{
      budgetId: any;
      categoryId: any;
      period: string;
      amountLimit: number;
      spent: number;
      remaining: number;
      isExceeded: boolean;
    }>
  > {
    const period = params.period ?? this.getCurrentPeriod();
    const filter: Record<string, any> = {
      userId: { eq: params.userId },
      period: { eq: period },
    };

    if (params.categoryId) {
      filter.categoryId = { eq: params.categoryId };
    }

    const budgets = await this.budgetRepository.getMany({ filter });

    if (budgets.length === 0) {
      return [];
    }

    const { from, to } = this.getPeriodRange(period);
    const categoryIds = budgets.map((budget) => budget.categoryId);

    const totals = await this.transactionRepository.getExpenseTotalsByCategory({
      userId: params.userId,
      categoryIds,
      from,
      to,
    });

    const totalsMap = new Map(
      totals.map((row) => [row.categoryId.toString(), row.total]),
    );

    const result = budgets.map((budget) => {
      const spent = totalsMap.get(budget.categoryId.toString()) ?? 0;
      const remaining = budget.amountLimit - spent;
      const isExceeded = spent > budget.amountLimit;

      return {
        budgetId: budget._id,
        categoryId: budget.categoryId,
        period: budget.period,
        amountLimit: budget.amountLimit,
        spent,
        remaining,
        isExceeded,
      };
    });

    await Promise.all(
      result
        .filter((item) => item.isExceeded)
        .map((item) =>
          this.notificationService.createBudgetExceededNotification({
            userId: params.userId,
            categoryId: item.categoryId,
            period: item.period,
            amountLimit: item.amountLimit,
            spent: item.spent,
          }),
        ),
    );

    return result;
  }

  private validateDataForUpdate(data: Partial<IUpdateBudgetParams>): boolean {
    return Object.values(data).some((value) => value !== undefined);
  }

  private getCurrentPeriod(): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");

    return `${year}-${month}`;
  }

  private getPeriodRange(period: string): { from: Date; to: Date } {
    const [year, month] = period.split("-").map((value) => Number(value));

    const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const to = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    return { from, to };
  }
}
