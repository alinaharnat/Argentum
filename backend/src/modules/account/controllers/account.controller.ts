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
import { AccountService } from "../services";
import {
  CreateAccountDto,
  AccountResponseDto,
  GetAccountByIdRequestDto,
  DeleteAccountRequest,
  EditAccountRequestBodyDto,
  EditAccountRequestParamsDto,
  GetUserAccountsResponseDto,
  ActivateAccountRequest,
  GetAccountsQueryDto,
} from "../dtos";
import { CurrentUserId } from "../../common/decorators";
import { AccessTokenGuard } from "../../auth/guards";

@UseGuards(AccessTokenGuard)
@Controller("accounts")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  public async createAccount(
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
  public async editAccount(
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

  @Patch(":id/activation")
  public async activateAccount(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: ActivateAccountRequest,
  ): Promise<AccountResponseDto> {
    const { id } = params;
    const updatedAccount = await this.accountService.setAccountStatus({
      _id: id,
      userId,
      isActive: true,
    });

    return new AccountResponseDto(updatedAccount);
  }

  @Get()
  public async getUserAccounts(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetAccountsQueryDto,
  ): Promise<GetUserAccountsResponseDto> {
    const data = await this.accountService.getUserAccounts({ userId, query });

    return new GetUserAccountsResponseDto({ data });
  }

  @Get(":id")
  public async getAccountById(
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
  public async deactivateAccount(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: DeleteAccountRequest,
  ): Promise<AccountResponseDto> {
    const { id } = params;
    const updatedAccount = await this.accountService.setAccountStatus({
      _id: id,
      userId,
      isActive: false,
    });

    return new AccountResponseDto(updatedAccount);
  }
}
