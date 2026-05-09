import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Account } from "../schemas";
import { IGetUserAccountsParams } from "../services/types";

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
  ) {
    super(accountModel);
  }

  public async getAccounts({
    userId,
    query,
  }: IGetUserAccountsParams): Promise<Account[]> {
    const { sortBy, sortOrder } = query;
    const filter = this.buildFilterForGetAccountsQuery({ userId, query });
    const sort = { [sortBy]: sortOrder };

    return this.getMany({ filter, sort });
  }

  private buildFilterForGetAccountsQuery({
    userId,
    query,
  }: IGetUserAccountsParams) {
    const filter: Record<string, any> = {
      userId: { eq: userId },
    };

    const filterStrategies: Record<string, any> = {
      isActive: (val: boolean) => ({ isActive: { eq: val } }),
      type: (val: string) => ({ type: { eq: val } }),
    };

    Object.keys(filterStrategies).forEach((key) => {
      const value = query[key as keyof typeof query];
      if (value !== undefined && value !== null) {
        Object.assign(filter, filterStrategies[key](value));
      }
    });

    return filter;
  }
}
