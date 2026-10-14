import { z } from "zod";

const positiveAmount = z
  .string()
  .min(1, "validation.enterAmount")
  .regex(/^\d+(\.\d{1,2})?$/, "validation.amountNumber")
  .refine((value) => Number(value) > 0, "validation.amountPositive");

const nonNegativeAmountOptional = z
  .string()
  .regex(/^(\d+(\.\d{1,2})?)?$/, "validation.amountNumber")
  .optional();

export const goalFormSchema = z.object({
  title: z
    .string()
    .min(1, "validation.titleRequired")
    .max(120, "validation.titleMax"),
  description: z
    .string()
    .max(500, "validation.descriptionMax")
    .optional(),
  targetAmount: positiveAmount,
  currentAmount: nonNegativeAmountOptional,
  currency: z
    .string()
    .regex(/^[A-Za-z]{3}$/, "validation.currencyRegex"),
  targetDate: z.string().optional(),
});

export const topUpSchema = z.object({
  amount: positiveAmount,
});

export type GoalFormData = z.infer<typeof goalFormSchema>;
export type TopUpFormData = z.infer<typeof topUpSchema>;