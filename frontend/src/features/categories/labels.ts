import { CategoryType, type Category } from "./types";

const SYSTEM_NAME_TRANSLATIONS: Record<string, string> = {
  food: "Їжа",
  transport: "Транспорт",
  shopping: "Покупки",
  entertainment: "Розваги",
  health: "Здоровʼя",
  education: "Освіта",
  bills: "Комунальні",
  travel: "Подорожі",
  housing: "Житло",
  salary: "Зарплата",
  freelance: "Фріланс",
  investments: "Інвестиції",
  gifts: "Подарунки",
};

const SYSTEM_NAME_BY_TYPE: Record<string, Partial<Record<CategoryType, string>>> = {
  other: {
    [CategoryType.Expense]: "Інші витрати",
    [CategoryType.Income]: "Інші доходи",
  },
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
    const byType = SYSTEM_NAME_BY_TYPE[key]?.[category.type];
    if (byType) return byType;
    return SYSTEM_NAME_TRANSLATIONS[key] ?? capitalize(category.name);
  }
  return capitalize(category.name);
}

export const categoryTypeLabels: Record<CategoryType, string> = {
  [CategoryType.Income]: "Дохід",
  [CategoryType.Expense]: "Витрата",
};

export const categoryTypePluralLabels: Record<CategoryType, string> = {
  [CategoryType.Income]: "Доходи",
  [CategoryType.Expense]: "Витрати",
};
