import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { AccessTokenGuard } from "../../auth/guards";
import { CurrentUserId } from "../../common/decorators";
import { AnalyticsService } from "../services";
import {
  GetExpensesByCategoryRequestQueryDto,
  ExpensesByCategoryResponseDto,
  ExpenseByCategoryItemDto,
  GetSummaryRequestQueryDto,
  SummaryResponseDto,
  GetMonthlyStatsRequestQueryDto,
  GetMonthlyStatsResponseDto,
  MonthlyStatItemDto,
} from "../dtos";

@UseGuards(AccessTokenGuard)
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("summary")
  public async getSummary(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetSummaryRequestQueryDto,
  ): Promise<SummaryResponseDto> {
    const summary = await this.analyticsService.getSummary({
      userId,
      period: query.period,
      from: query.from,
      to: query.to,
    });

    return new SummaryResponseDto(summary);
  }

  @Get("expenses-by-category")
  public async getExpensesByCategory(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetExpensesByCategoryRequestQueryDto,
  ): Promise<ExpensesByCategoryResponseDto> {
    const data = await this.analyticsService.getExpensesByCategory({
      userId,
      period: query.period,
      from: query.from,
      to: query.to,
    });

    return new ExpensesByCategoryResponseDto({
      data: data.map((item) => new ExpenseByCategoryItemDto(item)),
    });
  }

  @Get("monthly")
  public async getMonthlyStats(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetMonthlyStatsRequestQueryDto,
  ): Promise<GetMonthlyStatsResponseDto> {
    const data = await this.analyticsService.getMonthlyStats({
      userId,
      year: query.year,
    });

    return new GetMonthlyStatsResponseDto({
      data: data.map((item) => new MonthlyStatItemDto(item)),
    });
  }
}
