import { z } from "zod";
import { TransactionType } from "./types";

const transactionTypeValues = [
  TransactionType.Income,
  TransactionType.Expense,
] as const;

export const transactionFormSchema = z.object({
  accountId: z.string().min(1, "Оберіть рахунок"),
  categoryId: z.string().min(1, "Оберіть категорію"),
  type: z.enum(transactionTypeValues, { message: "Оберіть тип" }),
  amount: z
    .string()
    .min(1, "Введіть суму")
    .regex(/^\d+(\.\d{1,2})?$/, "Сума має бути числом, наприклад 199.99"),
  date: z.string().min(1, "Оберіть дату"),
  description: z.string().max(200, "Максимум 200 символів").optional(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;
