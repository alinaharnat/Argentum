import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BaseRepository } from "../../database/base-repository";
import { Transaction } from "../schemas";

@Injectable()
export class TransactionRepository extends BaseRepository<Transaction> {
  constructor(@InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>) {
    super(transactionModel);
  }
}
