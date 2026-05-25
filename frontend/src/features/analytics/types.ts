export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface ExpenseByCategory {
  categoryId: string;
  categoryName?: string;
  total: number;
}

export interface ExpensesByCategoryResponse {
  data: ExpenseByCategory[];
}

export interface MonthlyStat {
  month: number;
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyStatsResponse {
  data: MonthlyStat[];
}
