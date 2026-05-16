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
import { CategoryService } from "../services/category.service";
import { CurrentUserId } from "../../common/decorators";
import { Types } from "mongoose";
import {
  CategoryRequestParams,
  CategoryResponseDto,
  CreateCategoryRequestDto,
  GetCategoriesRequestQueryDto,
  GetCategoriesResponseDto,
  UpdateCategoryRequestBodyDto,
} from "../dtos";
import { AccessTokenGuard } from "../../auth/guards";
import { CategoryScope } from "../enums";
import { IconName } from "../enums";

@UseGuards(AccessTokenGuard)
@Controller("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  public async createCategory(
    @CurrentUserId() userId: Types.ObjectId,
    @Body() body: CreateCategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    const { name, type, icon, color } = body;
    const category = await this.categoryService.createCategory({
      name,
      type,
      icon,
      color,
      userId,
    });

    return this.toCategoryResponse(category);
  }

  @Get()
  public async getCategories(
    @CurrentUserId() userId: Types.ObjectId,
    @Query() query: GetCategoriesRequestQueryDto,
  ): Promise<GetCategoriesResponseDto> {
    const categories = await this.categoryService.getCategories({
      userId,
      name: query.name,
      type: query.type,
      scope: query.scope ?? CategoryScope.All,
    });

    return new GetCategoriesResponseDto({
      data: categories.map((category) => this.toCategoryResponse(category)),
    });
  }

  @Get(":id")
  public async getCategoryById(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: CategoryRequestParams,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.getCategoryById({
      userId,
      _id: params.id,
    });

    return this.toCategoryResponse(category);
  }

  @Patch(":id")
  public async updateCategory(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: CategoryRequestParams,
    @Body() body: UpdateCategoryRequestBodyDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryService.updateCategory({
      _id: params.id,
      userId,
      ...body,
      icon: body.icon as IconName | undefined,
    });

    return this.toCategoryResponse(category);
  }

  @Delete(":id")
  public async deleteCategory(
    @CurrentUserId() userId: Types.ObjectId,
    @Param() params: CategoryRequestParams,
  ): Promise<void> {
    await this.categoryService.deleteCategory({
      userId,
      _id: params.id,
    });
  }

  private toCategoryResponse(category: any): CategoryResponseDto {
    return new CategoryResponseDto({
      ...category,
      scope: category.userId ? CategoryScope.User : CategoryScope.System,
    });
  }
}
