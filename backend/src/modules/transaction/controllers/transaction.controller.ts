import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccessTokenGuard } from "../../auth/guards";
import { CurrentUserId } from "../../common/decorators";
import { TransactionService } from "../services";
import {
  CreateTransactionRequestDto,
  GetTransactionByIdRequestDto,
  GetUserTransactionsRequestQueryDto,
  GetUserTransactionsResponseDto,
  TransactionResponseDto,
  UpdateTransactionRequestBodyDto,
  UpdateTransactionRequestParamsDto,
} from "../dtos";

@UseGuards(AccessTokenGuard)
@Controller("transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  public async createTransaction(
    @CurrentUserId() userId: Types.ObjectId,
    @Body() body: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.createTransaction({
      userId,
      ...body,
    });

    return new TransactionResponseDto(transaction);
  }

  @Patch(":id")
  public async updateTransaction(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: UpdateTransactionRequestParamsDto,
    @Body() body: UpdateTransactionRequestBodyDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.updateTransaction({
      _id: params.id,
      userId,
      ...body,
    });

    return new TransactionResponseDto(transaction);
  }

  @Get()
  public async getUserTransactions(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetUserTransactionsRequestQueryDto,
  ): Promise<GetUserTransactionsResponseDto> {
    const data = await this.transactionService.getUserTransactions({
      userId,
      query,
    });

    return new GetUserTransactionsResponseDto({
      data: data.map((transaction) => new TransactionResponseDto(transaction)),
    });
  }

  @Get(":id")
  public async getTransactionById(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: GetTransactionByIdRequestDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionService.getTransactionById({
      _id: params.id,
      userId,
    });

    return new TransactionResponseDto(transaction);
  }

  @Delete(":id")
  public async deleteTransaction(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: GetTransactionByIdRequestDto,
  ): Promise<void> {
    await this.transactionService.deleteTransaction({
      _id: params.id,
      userId,
    });
  }
}
