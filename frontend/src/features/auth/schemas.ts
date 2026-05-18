import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введіть коректний email"),
  password: z.string().min(8, "Пароль має бути не менше 8 символів"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Ім'я має бути не менше 2 символів")
    .max(50, "Ім'я має бути не більше 50 символів"),
  lastName: z
    .string()
    .min(2, "Прізвище має бути не менше 2 символів")
    .max(50, "Прізвище має бути не більше 50 символів"),
  email: z.string().email("Введіть коректний email"),
  password: z
    .string()
    .min(8, "Пароль має бути не менше 8 символів")
    .max(32, "Пароль має бути не більше 32 символів")
    .regex(/[a-z]/, "Має містити малу літеру")
    .regex(/[A-Z]/, "Має містити велику літеру")
    .regex(/\d/, "Має містити цифру")
    .regex(/[^A-Za-z0-9]/, "Має містити спеціальний символ"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
