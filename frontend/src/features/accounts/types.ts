export const AccountType = {
  Cash: "CASH",
  Bank: "BANK",
  Savings: "SAVINGS",
} as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const SortOrder = {
  Ascending: 1,
  Descending: -1,
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface Account {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
}

export interface EditAccountRequest {
  name?: string;
  type?: AccountType;
  currency?: string;
}

export interface GetAccountsQuery {
  isActive?: boolean;
  type?: AccountType;
  sortBy?: "name" | "balance" | "createdAt";
  sortOrder?: SortOrder;
}

export interface GetAccountsResponse {
  data: Account[];
}
