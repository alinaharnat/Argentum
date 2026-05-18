import { z } from "zod";
import { AccountType } from "./types";

const accountTypeValues = [
  AccountType.Cash,
  AccountType.Bank,
  AccountType.Savings,
] as const;

const currencyField = z
  .string()
  .regex(/^[A-Za-z]{3}$|^$/, "Код валюти — 3 літери, наприклад UAH");

export const createAccountSchema = z.object({
  name: z
    .string()
    .min(1, "Назва обовʼязкова")
    .max(100, "Назва має бути не більше 100 символів"),
  type: z.enum(accountTypeValues, {
    message: "Оберіть тип рахунку",
  }),
  balance: z
    .string()
    .regex(/^-?\d*\.?\d*$/, "Баланс має бути числом")
    .optional(),
  currency: currencyField.optional(),
});

export const editAccountSchema = z.object({
  name: z
    .string()
    .min(1, "Назва обовʼязкова")
    .max(50, "Назва має бути не більше 50 символів"),
  type: z.enum(accountTypeValues, {
    message: "Оберіть тип рахунку",
  }),
  currency: z
    .string()
    .regex(/^[A-Za-z]{3}$/, "Код валюти — 3 літери, наприклад UAH"),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type EditAccountFormData = z.infer<typeof editAccountSchema>;
