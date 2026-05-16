import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { CategoryRepository } from "../repositories";
import { CategoryType, IconName } from "../enums";
import { Category } from "../schemas";
import { TFilter } from "../../database/types";

interface ISeedCategory {
  name: string;
  type: CategoryType;
  icon: IconName;
  color: string;
}

const DEFAULT_CATEGORIES: ISeedCategory[] = [
  {
    name: "food",
    type: CategoryType.Expense,
    icon: IconName.Food,
    color: "#F59E0B",
  },
  {
    name: "transport",
    type: CategoryType.Expense,
    icon: IconName.Transport,
    color: "#3B82F6",
  },
  {
    name: "shopping",
    type: CategoryType.Expense,
    icon: IconName.Shopping,
    color: "#EC4899",
  },
  {
    name: "entertainment",
    type: CategoryType.Expense,
    icon: IconName.Entertainment,
    color: "#8B5CF6",
  },
  {
    name: "health",
    type: CategoryType.Expense,
    icon: IconName.Health,
    color: "#10B981",
  },
  {
    name: "education",
    type: CategoryType.Expense,
    icon: IconName.Education,
    color: "#F97316",
  },
  {
    name: "bills",
    type: CategoryType.Expense,
    icon: IconName.Utilities,
    color: "#64748B",
  },
  {
    name: "travel",
    type: CategoryType.Expense,
    icon: IconName.Travel,
    color: "#06B6D4",
  },
  {
    name: "housing",
    type: CategoryType.Expense,
    icon: IconName.Home,
    color: "#A855F7",
  },
  {
    name: "other",
    type: CategoryType.Expense,
    icon: IconName.Other,
    color: "#6B7280",
  },
  {
    name: "salary",
    type: CategoryType.Income,
    icon: IconName.Salary,
    color: "#22C55E",
  },
  {
    name: "freelance",
    type: CategoryType.Income,
    icon: IconName.Work,
    color: "#14B8A6",
  },
  {
    name: "investments",
    type: CategoryType.Income,
    icon: IconName.Investment,
    color: "#F59E0B",
  },
  {
    name: "gifts",
    type: CategoryType.Income,
    icon: IconName.Gift,
    color: "#E879F9",
  },
  {
    name: "other",
    type: CategoryType.Income,
    icon: IconName.Other,
    color: "#6B7280",
  },
];

@Injectable()
export class CategorySeedService implements OnModuleInit {
  private readonly logger = new Logger(CategorySeedService.name);

  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async onModuleInit(): Promise<void> {
    const filter: TFilter<Category> = {
      userId: { isNull: true },
      isDeleted: { eq: false },
    };

    const existing = await this.categoryRepository.getMany({ filter });
    const existingKeys = new Set(
      existing.map((category) =>
        this.buildKey(category.name, category.type as CategoryType),
      ),
    );

    const missing = DEFAULT_CATEGORIES.filter(
      (category) =>
        !existingKeys.has(this.buildKey(category.name, category.type)),
    );

    if (missing.length === 0) {
      return;
    }

    await Promise.all(
      missing.map((category) =>
        this.categoryRepository.create({
          name: category.name,
          type: category.type,
          icon: category.icon,
          color: category.color,
          isDeleted: false,
        }),
      ),
    );

    this.logger.log(`Seeded ${missing.length} default categories`);
  }

  private buildKey(name: string, type: CategoryType | string): string {
    return `${type}:${name.toLowerCase()}`;
  }
}
