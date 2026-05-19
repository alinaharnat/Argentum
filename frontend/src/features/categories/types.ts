export const CategoryType = {
  Income: "INCOME",
  Expense: "EXPENSE",
} as const;
export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

export const CategoryScope = {
  User: "user",
  System: "system",
  All: "all",
} as const;
export type CategoryScope = (typeof CategoryScope)[keyof typeof CategoryScope];

export const IconName = {
  Folder: "folder",
  Other: "other",
  Home: "home",
  Utilities: "utilities",
  Car: "car",
  Transport: "transport",
  Food: "food",
  Cafe: "cafe",
  Shopping: "shopping",
  Entertainment: "entertainment",
  Hobbies: "hobbies",
  Health: "health",
  Pharmacy: "pharmacy",
  Education: "education",
  Travel: "travel",
  Sport: "sport",
  Beauty: "beauty",
  Pets: "pets",
  Subscriptions: "subscriptions",
  Wallet: "wallet",
  Salary: "salary",
  Gift: "gift",
  Investment: "investment",
  Bonus: "bonus",
  Refund: "refund",
  Charity: "charity",
  Family: "family",
  Work: "work",
} as const;
export type IconName = (typeof IconName)[keyof typeof IconName];

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
  icon: IconName;
  color: string;
  isDeleted: boolean;
  scope: Exclude<CategoryScope, "all">;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  icon?: IconName;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: CategoryType;
  icon?: IconName;
  color?: string;
}

export interface GetCategoriesQuery {
  type?: CategoryType;
  name?: string;
  scope?: CategoryScope;
}

export interface GetCategoriesResponse {
  data: Category[];
}
