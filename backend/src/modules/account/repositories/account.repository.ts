import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Account } from "../schemas";

@Injectable()
export class AccountRepository extends BaseRepository<Account> {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {
    super(accountModel);
  }
}
