export const TransactionType = {
  Income: "INCOME",
  Expense: "EXPENSE",
} as const;
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionSortField = {
  Date: "date",
  Amount: "amount",
  Type: "type",
} as const;
export type TransactionSortField =
  (typeof TransactionSortField)[keyof typeof TransactionSortField];

export const SortOrder = {
  Ascending: 1,
  Descending: -1,
} as const;
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export interface Transaction {
  _id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  description?: string;
}

export interface CreateTransactionRequest {
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date?: string;
  description?: string;
}

export interface UpdateTransactionRequest {
  accountId?: string;
  categoryId?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
  description?: string;
}

export interface GetTransactionsQuery {
  categoryId?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  limit?: number;
  offset?: number;
  sortBy?: TransactionSortField;
  sortOrder?: SortOrder;
}

export interface GetTransactionsResponse {
  data: Transaction[];
}
