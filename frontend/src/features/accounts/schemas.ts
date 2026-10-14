import { z } from "zod";
import { AccountType } from "./types";

const accountTypeValues = [
  AccountType.Cash,
  AccountType.Bank,
  AccountType.Savings,
] as const;

const currencyField = z
  .string()
  .regex(/^[A-Za-z]{3}$|^$/, "validation.currencyRegex");

export const createAccountSchema = z.object({
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .max(100, "validation.nameMax100"),
  type: z.enum(accountTypeValues, {
    message: "validation.selectType",
  }),
  balance: z
    .string()
    .regex(/^-?\d*\.?\d*$/, "validation.balanceNumber")
    .optional(),
  currency: currencyField.optional(),
});

export const editAccountSchema = z.object({
  name: z
    .string()
    .min(1, "validation.nameRequired")
    .max(50, "validation.nameMax50"),
  type: z.enum(accountTypeValues, {
    message: "validation.selectType",
  }),
  currency: z
    .string()
    .regex(/^[A-Za-z]{3}$/, "validation.currencyRegex"),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type EditAccountFormData = z.infer<typeof editAccountSchema>;