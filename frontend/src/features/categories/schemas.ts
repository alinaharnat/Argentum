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
    .min(1, "validation.nameRequired")
    .max(50, "validation.nameMax50"),
  type: z.enum(categoryTypeValues, { message: "validation.selectType" }),
  icon: z.enum(iconValues),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "validation.colorRegex"),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;