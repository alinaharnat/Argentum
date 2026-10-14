import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("validation.emailInvalid"),
  password: z.string().min(8, "validation.passwordMin"),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "validation.firstNameMin")
    .max(50, "validation.firstNameMax"),
  lastName: z
    .string()
    .min(2, "validation.lastNameMin")
    .max(50, "validation.lastNameMax"),
  email: z.string().email("validation.emailInvalid"),
  password: z
    .string()
    .min(8, "validation.passwordMin")
    .max(32, "validation.passwordMax")
    .regex(/[a-z]/, "validation.passwordLowercase")
    .regex(/[A-Z]/, "validation.passwordUppercase")
    .regex(/\d/, "validation.passwordNumber")
    .regex(/[^A-Za-z0-9]/, "validation.passwordSpecial"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;