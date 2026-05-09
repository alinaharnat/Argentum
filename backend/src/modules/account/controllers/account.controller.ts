import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
  EditAccountRequestParamsDto,
  GetUserAccountsResponseDto,
} from "../dtos";
import { CurrentUserId } from "../../common/decorators";
import { AccessTokenGuard } from "../../auth/guards";

@UseGuards(AccessTokenGuard)
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
    @Param() params: EditAccountRequestParamsDto,
    @Body() body: EditAccountRequestBodyDto,
    @CurrentUserId() userId: Types.ObjectId,
  ): Promise<AccountResponseDto> {
    const { id } = params;
    const updatedAccount = await this.accountService.editAccount({
      _id: id,
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
    @Param() params: GetAccountByIdRequestDto,
  ): Promise<AccountResponseDto> {
    const { id } = params;
    console.log(id);
    const account = await this.accountService.getAccountById({
      _id: id,
      userId,
    });
    return new AccountResponseDto(account);
  }

  @Delete(":id")
  async deleteAccount(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: DeleteAccountRequest,
  ): Promise<void> {
    const { id } = params;
    await this.accountService.deleteAccount({ _id: id, userId });
  }
}
