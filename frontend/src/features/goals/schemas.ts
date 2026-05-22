import { z } from "zod";

const positiveAmount = z
  .string()
  .min(1, "Введіть суму")
  .regex(/^\d+(\.\d{1,2})?$/, "Сума має бути числом, наприклад 50000")
  .refine((value) => Number(value) > 0, "Сума має бути більше 0");

const nonNegativeAmountOptional = z
  .string()
  .regex(/^(\d+(\.\d{1,2})?)?$/, "Сума має бути числом")
  .optional();

export const goalFormSchema = z.object({
  title: z
    .string()
    .min(1, "Назва обовʼязкова")
    .max(120, "Назва має бути не більше 120 символів"),
  description: z
    .string()
    .max(500, "Опис має бути не більше 500 символів")
    .optional(),
  targetAmount: positiveAmount,
  currentAmount: nonNegativeAmountOptional,
  currency: z
    .string()
    .regex(/^[A-Za-z]{3}$/, "Код валюти — 3 літери, наприклад UAH"),
  targetDate: z.string().optional(),
});

export const topUpSchema = z.object({
  amount: positiveAmount,
});

export type GoalFormData = z.infer<typeof goalFormSchema>;
export type TopUpFormData = z.infer<typeof topUpSchema>;
