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
import { GoalService } from "../services";
import {
  CreateGoalRequestDto,
  DeleteGoalRequestDto,
  GetGoalByIdRequestDto,
  GetUserGoalsRequestQueryDto,
  GetUserGoalsResponseDto,
  GoalResponseDto,
  UpdateGoalRequestBodyDto,
  UpdateGoalRequestParamsDto,
} from "../dtos";

@UseGuards(AccessTokenGuard)
@Controller("goals")
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  public async createGoal(
    @CurrentUserId() userId: Types.ObjectId,
    @Body() body: CreateGoalRequestDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalService.createGoal({
      userId,
      ...body,
    });

    return new GoalResponseDto(goal);
  }

  @Patch(":id")
  public async updateGoal(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: UpdateGoalRequestParamsDto,
    @Body() body: UpdateGoalRequestBodyDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalService.updateGoal({
      _id: new Types.ObjectId(params.id),
      userId,
      ...body,
    });

    return new GoalResponseDto(goal);
  }

  @Get(":id")
  public async getGoalById(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: GetGoalByIdRequestDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalService.getGoalById({
      _id: new Types.ObjectId(params.id),
      userId,
    });

    return new GoalResponseDto(goal);
  }

  @Get()
  public async getUserGoals(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetUserGoalsRequestQueryDto,
  ): Promise<GetUserGoalsResponseDto> {
    const data = await this.goalService.getUserGoals({
      userId,
      query,
    });

    return new GetUserGoalsResponseDto({
      data: data.map((goal) => new GoalResponseDto(goal)),
    });
  }

  @Delete(":id")
  public async deleteGoal(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: DeleteGoalRequestDto,
  ): Promise<GoalResponseDto> {
    const goal = await this.goalService.deleteGoal({
      _id: new Types.ObjectId(params.id),
      userId,
    });

    return new GoalResponseDto(goal);
  }
}
