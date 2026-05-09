import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccountRepository } from "../repositories";
import {
  ICreateAccountParams,
  IDeleteAccountParams,
  IValidateOwnershipParams,
  IEditAccountParams,
  IGetAccountByIdParams,
} from "./types";
import { Account } from "../schemas";

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  public createAccount(params: ICreateAccountParams): Promise<Account> {
    return this.accountRepository.create(params);
  }

  public async deleteAccount({
    _id,
    userId,
  }: IDeleteAccountParams): Promise<Account | null> {
    const isOwner = await this.validateAccountOwnership({ _id, userId });

    if (!isOwner) {
      throw new ForbiddenException("User does not own this account");
    }

    return this.accountRepository.update(
      { filter: { _id: { eq: _id } } },
      { isActive: false },
    );
  }

  public async editAccount(params: IEditAccountParams): Promise<Account> {
    const { _id, userId, ...dataForUpdate } = params;

    const isDataValid = this.validateDataForUpdate(dataForUpdate);

    if (!isDataValid) {
      throw new BadRequestException("No data provided for update");
    }

    const isOwner = await this.validateAccountOwnership({ _id, userId });

    if (!isOwner) {
      throw new ForbiddenException("User does not own this account");
    }

    const account = await this.accountRepository.update(
      { filter: { _id } },
      dataForUpdate,
    );

    if (!account) {
      throw new NotFoundException("Account not found");
    }

    return account;
  }

  public async getAccountById({
    _id,
    userId,
  }: IGetAccountByIdParams): Promise<Account> {
    const isOwner = await this.validateAccountOwnership({ _id, userId });

    if (!isOwner) {
      throw new ForbiddenException("User does not own this account");
    }

    const account = await this.accountRepository.get({
      _id: { eq: _id },
      isActive: { eq: true },
    });

    if (!account) {
      throw new NotFoundException("Account not found");
    }

    return account;
  }

  public async getUserAccounts(userId: Types.ObjectId): Promise<Account[]> {
    return this.accountRepository.getMany({
      filter: { userId: { eq: userId }, isActive: { eq: true } },
    });
  }

  private async validateAccountOwnership({
    _id,
    userId,
  }: IValidateOwnershipParams): Promise<boolean> {
    const account = await this.accountRepository.get({
      _id: { eq: _id },
      userId: { eq: userId },
    });

    return !!account;
  }

  private validateDataForUpdate(data: Partial<IEditAccountParams>): boolean {
    return Object.values(data).some((value) => value !== undefined);
  }
}
