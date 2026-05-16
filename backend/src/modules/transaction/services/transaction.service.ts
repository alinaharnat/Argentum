import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TransactionRepository } from "../repositories";
import {
  ICreateTransactionParams,
  IDeleteTransactionParams,
  IGetTransactionByIdParams,
  IGetUserTransactionsParams,
  IUpdateTransactionParams,
} from "./types";
import { Transaction } from "../schemas";
import { AccountService } from "../../account/services";
import { CategoryService } from "../../category/services/category.service";
import { TFilter } from "../../database/types";

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
  ) {}

  public async createTransaction(
    params: ICreateTransactionParams,
  ): Promise<Transaction> {
    const { userId, accountId, categoryId, type } = params;

    await this.accountService.getAccountById({ _id: accountId, userId });

    const category = await this.categoryService.getCategoryById({
      _id: categoryId,
      userId,
    });

    if (category.type !== type) {
      throw new BadRequestException("Category type does not match transaction");
    }

    return this.transactionRepository.create(params);
  }

  public async updateTransaction(
    params: IUpdateTransactionParams,
  ): Promise<Transaction> {
    const { _id, userId, ...dataForUpdate } = params;

    if (!this.validateDataForUpdate(dataForUpdate)) {
      throw new BadRequestException("No data provided for update");
    }

    const existing = await this.transactionRepository.get({
      _id: { eq: _id },
      userId: { eq: userId },
    });

    if (!existing) {
      throw new NotFoundException("Transaction not found");
    }

    if (dataForUpdate.accountId) {
      await this.accountService.getAccountById({
        _id: dataForUpdate.accountId,
        userId,
      });
    }

    const categoryIdToCheck = dataForUpdate.categoryId ?? existing.categoryId;
    const typeToCheck = dataForUpdate.type ?? existing.type;

    if (dataForUpdate.categoryId || dataForUpdate.type) {
      const category = await this.categoryService.getCategoryById({
        _id: categoryIdToCheck,
        userId,
      });

      if (category.type !== typeToCheck) {
        throw new BadRequestException(
          "Category type does not match transaction",
        );
      }
    }

    const updated = await this.transactionRepository.update(
      { filter: { _id: { eq: _id } } },
      dataForUpdate,
    );

    if (!updated) {
      throw new NotFoundException("Transaction not found");
    }

    return updated;
  }

  public async getTransactionById({
    _id,
    userId,
  }: IGetTransactionByIdParams): Promise<Transaction> {
    const transaction = await this.transactionRepository.get({
      _id: { eq: _id },
      userId: { eq: userId },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  public async getUserTransactions({
    userId,
    query,
  }: IGetUserTransactionsParams): Promise<Transaction[]> {
    const filter: TFilter<Transaction> = {
      userId: { eq: userId },
    };

    if (query.categoryId) {
      filter.categoryId = { eq: query.categoryId };
    }

    if (query.type) {
      filter.type = { eq: query.type } as any;
    }

    if (query.dateFrom || query.dateTo) {
      filter.date = {} as any;

      if (query.dateFrom) {
        filter.date.gte = query.dateFrom;
      }

      if (query.dateTo) {
        filter.date.lte = query.dateTo;
      }
    }

    if (query.amountMin !== undefined || query.amountMax !== undefined) {
      filter.amount = {} as any;

      if (query.amountMin !== undefined) {
        filter.amount.gte = query.amountMin;
      }

      if (query.amountMax !== undefined) {
        filter.amount.lte = query.amountMax;
      }
    }

    return this.transactionRepository.getMany({
      filter,
      sort: { [query.sortBy]: query.sortOrder },
      pagination: {
        limit: query.limit,
        offset: query.offset,
      },
    });
  }

  public async deleteTransaction({
    _id,
    userId,
  }: IDeleteTransactionParams): Promise<void> {
    const deleted = await this.transactionRepository.delete({
      filter: { _id: { eq: _id }, userId: { eq: userId } },
    });

    if (!deleted) {
      throw new NotFoundException("Transaction not found");
    }
  }

  private validateDataForUpdate(
    data: Partial<IUpdateTransactionParams>,
  ): boolean {
    return Object.values(data).some((value) => value !== undefined);
  }
}
