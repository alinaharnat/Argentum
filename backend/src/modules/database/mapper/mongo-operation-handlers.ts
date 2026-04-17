import type { TFieldFilter } from "../types/field-filter";

export const MONGO_OPERATION_HANDLERS: Record<
  keyof TFieldFilter<any>,
  (value: any) => any
> = {
  eq: (value) => ({ $eq: value }),
  ne: (value) => ({ $ne: value }),
  in: (value) => ({ $in: value }),
  like: (value) => ({ $regex: value }),
  ilike: (value) => ({ $regex: value, $options: "i" }),
  gt: (value) => ({ $gt: value }),
  gte: (value) => ({ $gte: value }),
  lt: (value) => ({ $lt: value }),
  lte: (value) => ({ $lte: value }),
  isNull: (value) => (value ? { $eq: null } : { $ne: null }),
};
