import i18n from "@/lib/i18n";
import { CategoryType, type Category } from "./types";

const SYSTEM_CATEGORY_KEYS: Record<string, string> = {
  food: "categories:systemCategories.food",
  transport: "categories:systemCategories.transport",
  shopping: "categories:systemCategories.shopping",
  entertainment: "categories:systemCategories.entertainment",
  health: "categories:systemCategories.health",
  education: "categories:systemCategories.education",
  bills: "categories:systemCategories.bills",
  travel: "categories:systemCategories.travel",
  housing: "categories:systemCategories.housing",
  salary: "categories:systemCategories.salary",
  freelance: "categories:systemCategories.freelance",
  investments: "categories:systemCategories.investments",
  gifts: "categories:systemCategories.gifts",
};

function capitalize(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getCategoryDisplayName(category: {
  name: string;
  type: CategoryType;
  scope: Category["scope"];
}): string {
  if (category.scope === "system") {
    const key = category.name.toLowerCase();
    if (key === "other") {
      return category.type === CategoryType.Expense
        ? i18n.t("categories:systemCategories.otherExpense")
        : i18n.t("categories:systemCategories.otherIncome");
    }
    const translationKey = SYSTEM_CATEGORY_KEYS[key];
    if (translationKey) {
      return i18n.t(translationKey);
    }
  }
  return capitalize(category.name);
}