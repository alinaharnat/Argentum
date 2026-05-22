import { z } from "zod";

const amountLimitField = z
  .string()
  .min(1, "Введіть суму")
  .regex(/^\d+(\.\d{1,2})?$/, "Сума має бути числом, наприклад 5000")
  .refine((value) => Number(value) > 0, "Сума має бути більше 0");

export const budgetCreateSchema = z.object({
  categoryId: z.string().min(1, "Оберіть категорію"),
  amountLimit: amountLimitField,
});

export const budgetEditSchema = z.object({
  amountLimit: amountLimitField,
});

export type BudgetCreateFormData = z.infer<typeof budgetCreateSchema>;
export type BudgetEditFormData = z.infer<typeof budgetEditSchema>;
