import { z } from "zod";

const amountLimitField = z
  .string()
  .min(1, "validation.enterAmount")
  .regex(/^\d+(\.\d{1,2})?$/, "validation.amountNumber")
  .refine((value) => Number(value) > 0, "validation.amountPositive");

export const budgetCreateSchema = z.object({
  categoryId: z.string().min(1, "validation.selectCategory"),
  amountLimit: amountLimitField,
});

export const budgetEditSchema = z.object({
  amountLimit: amountLimitField,
});

export type BudgetCreateFormData = z.infer<typeof budgetCreateSchema>;
export type BudgetEditFormData = z.infer<typeof budgetEditSchema>;