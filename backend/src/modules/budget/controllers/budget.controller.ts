import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccessTokenGuard } from "../../auth/guards";
import { CurrentUserId } from "../../common/decorators";
import { BudgetService } from "../services";
import {
  BudgetResponseDto,
  CreateBudgetRequestDto,
  GetBudgetStatusRequestQueryDto,
  GetBudgetStatusResponseDto,
  UpdateBudgetRequestBodyDto,
  UpdateBudgetRequestParamsDto,
  BudgetStatusResponseDto,
} from "../dtos";

@UseGuards(AccessTokenGuard)
@Controller("budgets")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  public async createBudget(
    @CurrentUserId() userId: Types.ObjectId,
    @Body() body: CreateBudgetRequestDto,
  ): Promise<BudgetResponseDto> {
    const budget = await this.budgetService.createBudget({
      userId,
      ...body,
    });

    return new BudgetResponseDto(budget);
  }

  @Patch(":id")
  public async updateBudget(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: UpdateBudgetRequestParamsDto,
    @Body() body: UpdateBudgetRequestBodyDto,
  ): Promise<BudgetResponseDto> {
    const budget = await this.budgetService.updateBudget({
      _id: params.id,
      userId,
      ...body,
    });

    return new BudgetResponseDto(budget);
  }

  @Get("status")
  public async getBudgetStatus(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetBudgetStatusRequestQueryDto,
  ): Promise<GetBudgetStatusResponseDto> {
    const data = await this.budgetService.getBudgetStatus({
      userId,
      period: query.period,
      categoryId: query.categoryId,
    });

    return new GetBudgetStatusResponseDto({
      data: data.map((item) => new BudgetStatusResponseDto(item)),
    });
  }
}
