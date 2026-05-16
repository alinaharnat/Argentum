import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { CategoryService } from "../../category/services/category.service";
import { TransactionRepository } from "../../transaction/repositories";
import { TransactionType } from "../../transaction/enums";

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryService: CategoryService,
  ) {}

  public async getSummary(params: {
    userId: Types.ObjectId;
    period?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ totalIncome: number; totalExpenses: number; balance: number }> {
    const { from, to } = this.resolveRange(params);
    const totals = await this.transactionRepository.getTotalsByType({
      userId: params.userId,
      from,
      to,
    });

    return {
      totalIncome: totals.income,
      totalExpenses: totals.expense,
      balance: totals.income - totals.expense,
    };
  }

  public async getExpensesByCategory(params: {
    userId: Types.ObjectId;
    period?: string;
    from?: Date;
    to?: Date;
  }): Promise<
    Array<{ categoryId: Types.ObjectId; categoryName?: string; total: number }>
  > {
    const { from, to } = this.resolveRange(params);
    const totals = await this.transactionRepository.getExpenseTotalsByCategory({
      userId: params.userId,
      categoryIds: [],
      from,
      to,
    });

    if (totals.length === 0) {
      return [];
    }

    const categories = await this.categoryService.getCategoriesByIds({
      userId: params.userId,
      ids: totals.map((item) => item.categoryId),
    });

    const categoryMap = new Map(
      categories.map((category) => [category._id.toString(), category.name]),
    );

    return totals.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId.toString()),
      total: item.total,
    }));
  }

  public async getMonthlyStats(params: {
    userId: Types.ObjectId;
    year?: number;
  }): Promise<
    Array<{ month: number; income: number; expense: number; balance: number }>
  > {
    const year = params.year ?? new Date().getUTCFullYear();
    const totals = await this.transactionRepository.getMonthlyTotals({
      userId: params.userId,
      year,
    });

    return totals.map((item) => ({
      month: item.month,
      income: item.income,
      expense: item.expense,
      balance: item.income - item.expense,
    }));
  }

  private resolveRange(params: { period?: string; from?: Date; to?: Date }): {
    from: Date;
    to: Date;
  } {
    if (params.from && params.to) {
      return { from: params.from, to: params.to };
    }

    if (params.period) {
      const [year, month] = params.period
        .split("-")
        .map((value) => Number(value));
      return {
        from: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
        to: new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
      };
    }

    const now = new Date();
    return {
      from: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0),
      ),
      to: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0),
      ),
    };
  }
}
