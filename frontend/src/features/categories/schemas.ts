import { z } from "zod";
import { CategoryType, IconName } from "./types";

const categoryTypeValues = [
  CategoryType.Income,
  CategoryType.Expense,
] as const;

const iconValues = Object.values(IconName) as [IconName, ...IconName[]];

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Назва обовʼязкова")
    .max(50, "Назва має бути не більше 50 символів"),
  type: z.enum(categoryTypeValues, { message: "Оберіть тип" }),
  icon: z.enum(iconValues),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Колір має бути у форматі #RRGGBB"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
