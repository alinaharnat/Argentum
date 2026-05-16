import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Transaction } from "../schemas";
import { TransactionType } from "../enums";

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {
    super(transactionModel);
  }

  public async getTotalsByType(params: {
    userId: Types.ObjectId;
    from: Date;
    to: Date;
  }): Promise<{ income: number; expense: number }> {
    const result = await this.transactionModel
      .aggregate([
        {
          $match: {
            userId: params.userId,
            date: { $gte: params.from, $lt: params.to },
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ])
      .exec();

    const totals = { income: 0, expense: 0 };

    result.forEach((row) => {
      if (row._id === TransactionType.Income) {
        totals.income = row.total;
      }
      if (row._id === TransactionType.Expense) {
        totals.expense = row.total;
      }
    });

    return totals;
  }

  public async getExpenseTotalsByCategory(params: {
    userId: Types.ObjectId;
    categoryIds: Types.ObjectId[];
    from: Date;
    to: Date;
  }): Promise<Array<{ categoryId: Types.ObjectId; total: number }>> {
    const match: Record<string, any> = {
      userId: params.userId,
      type: TransactionType.Expense,
      date: { $gte: params.from, $lt: params.to },
    };

    if (params.categoryIds.length > 0) {
      match.categoryId = { $in: params.categoryIds };
    }

    const result = await this.transactionModel
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: "$categoryId",
            total: { $sum: "$amount" },
          },
        },
      ])
      .exec();

    return result.map((row) => ({ categoryId: row._id, total: row.total }));
  }

  public async getMonthlyTotals(params: {
    userId: Types.ObjectId;
    year: number;
  }): Promise<Array<{ month: number; income: number; expense: number }>> {
    const start = new Date(Date.UTC(params.year, 0, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(params.year + 1, 0, 1, 0, 0, 0, 0));

    const result = await this.transactionModel
      .aggregate([
        {
          $match: {
            userId: params.userId,
            date: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
      ])
      .exec();

    const totalsByMonth = new Map<
      number,
      { income: number; expense: number }
    >();

    result.forEach((row) => {
      const month = row._id.month;
      const current = totalsByMonth.get(month) ?? { income: 0, expense: 0 };

      if (row._id.type === TransactionType.Income) {
        current.income = row.total;
      }

      if (row._id.type === TransactionType.Expense) {
        current.expense = row.total;
      }

      totalsByMonth.set(month, current);
    });

    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const totals = totalsByMonth.get(month) ?? { income: 0, expense: 0 };

      return {
        month,
        income: totals.income,
        expense: totals.expense,
      };
    });
  }
}
