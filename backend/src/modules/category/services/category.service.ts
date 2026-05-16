import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CategoryRepository } from "../repositories";
import {
  ICreateCategoryCreateParams,
  IValidateCreateCategoryCreateParams,
  IValidateOwnershipParams,
  IGetCategoryByIdParams,
  IDeleteCategoryParams,
  IGetCategoriesParams,
  IUpdateCategoryParams,
  IGetCategoriesByIdsParams,
} from "./types";
import { Category } from "../schemas";
import { CategoryScope } from "../enums";
import { TFilter } from "../../database/types";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async createCategory({
    userId,
    name,
    type,
    icon,
    color,
  }: ICreateCategoryCreateParams): Promise<Category> {
    const isCategoryExist = await this.validateCreateCategory({
      userId,
      name,
      type,
    });

    if (isCategoryExist) {
      throw new BadRequestException(
        "Category with the same name and type already exists",
      );
    }

    const category = await this.categoryRepository.create({
      userId,
      name,
      type,
      icon,
      color,
    });

    return category;
  }

  public async getCategoryById({
    _id,
    userId,
  }: IGetCategoryByIdParams): Promise<Category> {
    const hasAccess = await this.validateGetAccess({ _id, userId });

    if (!hasAccess) {
      throw new BadRequestException("You don't have access to this category");
    }

    const category = await this.categoryRepository.getById(_id);

    if (!category) {
      throw new BadRequestException("Category not found");
    }

    return category;
  }

  public async getCategories({
    userId,
    type,
    scope,
    name,
  }: IGetCategoriesParams): Promise<Category[]> {
    const scopeFilters = {
      [CategoryScope.System]: { userId: { isNull: true } },
      [CategoryScope.User]: { userId: { eq: userId } },
      [CategoryScope.All]: {
        OR: [{ userId: { eq: userId } }, { userId: { isNull: true } }],
      },
    };

    const userScopeFilter =
      scopeFilters[scope] ?? scopeFilters[CategoryScope.All];

    const categoryFilter: TFilter<Category> = {
      ...userScopeFilter,
      isDeleted: { eq: false },
    };

    if (type) {
      categoryFilter.type = { eq: type };
    }

    if (name) {
      categoryFilter.name = { ilike: name };
    }

    return await this.categoryRepository.getMany({
      filter: categoryFilter,
      sort: { name: 1 },
    });
  }

  public async getCategoriesByIds({
    userId,
    ids,
  }: IGetCategoriesByIdsParams): Promise<Category[]> {
    const filter: TFilter<Category> = {
      OR: [{ userId: { eq: userId } }, { userId: { isNull: true } }],
      _id: { in: ids },
      isDeleted: { eq: false },
    };

    return this.categoryRepository.getMany({
      filter,
      sort: { name: 1 },
    });
  }

  public async updateCategory({
    userId,
    _id,
    ...dataForUpdate
  }: IUpdateCategoryParams): Promise<Category> {
    const isDataValid = this.validateDataForUpdate(dataForUpdate);

    if (!isDataValid) {
      throw new BadRequestException("No data provided for update");
    }

    const hasAccess = await this.validateDeletionAccess({ userId, _id });

    if (!hasAccess) {
      throw new BadRequestException("You don't have access to this category");
    }

    const category = await this.categoryRepository.update(
      { filter: { _id: { eq: _id } } },
      dataForUpdate,
    );

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  public async deleteCategory({
    userId,
    _id,
  }: IDeleteCategoryParams): Promise<void> {
    const hasAccess = await this.validateDeletionAccess({
      userId,
      _id,
    });

    if (!hasAccess) {
      throw new BadRequestException("You don't have access to this category");
    }

    await this.categoryRepository.update(
      { filter: { _id: { eq: _id } } },
      { isDeleted: true },
    );
  }

  private async validateDeletionAccess({
    userId,
    _id,
  }: IValidateOwnershipParams): Promise<boolean> {
    const category = await this.categoryRepository.get({
      userId: { eq: userId },
      _id: { eq: _id },
    });

    return !!category;
  }

  private async validateGetAccess({
    userId,
    _id,
  }: IValidateOwnershipParams): Promise<boolean> {
    const category = await this.categoryRepository.get({
      OR: [{ userId: { eq: userId } }, { userId: { isNull: true } }],
      _id: { eq: _id },
    });

    return !!category;
  }

  private async validateCreateCategory({
    userId,
    name,
    type,
  }: IValidateCreateCategoryCreateParams): Promise<boolean> {
    const category = await this.categoryRepository.get({
      OR: [{ userId: { eq: userId } }, { userId: { isNull: true } }],
      name: { ilike: name },
      type: { eq: type },
      isDeleted: { eq: false },
    });

    return !!category;
  }

  private validateDataForUpdate(data: Partial<IUpdateCategoryParams>): boolean {
    return Object.values(data).some((value) => value !== undefined);
  }
}
