export interface Budget {
  _id: string;
  userId: string;
  categoryId: string;
  amountLimit: number;
  period: string;
}

export interface BudgetStatus {
  budgetId: string;
  categoryId: string;
  period: string;
  amountLimit: number;
  spent: number;
  remaining: number;
  isExceeded: boolean;
}

export interface CreateBudgetRequest {
  categoryId: string;
  amountLimit: number;
  period: string;
}

export interface UpdateBudgetRequest {
  amountLimit: number;
}

export interface GetBudgetStatusQuery {
  period?: string;
  categoryId?: string;
}

export interface GetBudgetStatusResponse {
  data: BudgetStatus[];
}
