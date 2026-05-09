import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccountService } from "../services";
import {
  CreateAccountDto,
  AccountResponseDto,
  GetAccountByIdRequestDto,
  DeleteAccountRequest,
  EditAccountRequestBodyDto,
  EditAccountRequestQueryDto,
  GetUserAccountsResponseDto,
} from "../dtos";
import { CurrentUserId } from "../../common/decorators";

@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async createAccount(
    @Body() body: CreateAccountDto,
    @CurrentUserId() userId: Types.ObjectId,
  ): Promise<AccountResponseDto> {
    const createdAccount = await this.accountService.createAccount({
      ...body,
      userId,
    });

    return new AccountResponseDto(createdAccount);
  }

  @Patch(":id")
  async editAccount(
    @Query() query: EditAccountRequestQueryDto,
    @Body() body: EditAccountRequestBodyDto,
    @CurrentUserId() userId: Types.ObjectId,
  ): Promise<AccountResponseDto> {
    const { _id } = query;

    const updatedAccount = await this.accountService.editAccount({
      _id,
      userId,
      ...body,
    });

    return new AccountResponseDto(updatedAccount);
  }

  @Get()
  async getUserAccounts(
    @CurrentUserId() userId: Types.ObjectId,
  ): Promise<GetUserAccountsResponseDto> {
    const data = await this.accountService.getUserAccounts(userId);

    return new GetUserAccountsResponseDto({ data });
  }

  @Get(":id")
  async getAccountById(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetAccountByIdRequestDto,
  ): Promise<AccountResponseDto> {
    const { _id } = query;
    const account = await this.accountService.getAccountById({ _id, userId });
    return new AccountResponseDto(account);
  }

  @Delete(":id")
  async deleteAccount(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: DeleteAccountRequest,
  ): Promise<void> {
    const { _id } = query;
    await this.accountService.deleteAccount({ _id, userId });
  }
}
