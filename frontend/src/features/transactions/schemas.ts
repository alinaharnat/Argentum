import { z } from "zod";
import { TransactionType } from "./types";

const transactionTypeValues = [
  TransactionType.Income,
  TransactionType.Expense,
] as const;

export const transactionFormSchema = z.object({
  accountId: z.string().min(1, "validation.selectAccount"),
  categoryId: z.string().min(1, "validation.selectCategory"),
  type: z.enum(transactionTypeValues, { message: "validation.selectType" }),
  amount: z
    .string()
    .min(1, "validation.enterAmount")
    .regex(/^\d+(\.\d{1,2})?$/, "validation.amountNumber"),
  date: z.string().min(1, "validation.selectDate"),
  description: z.string().max(200, "validation.descriptionMax").optional(),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;