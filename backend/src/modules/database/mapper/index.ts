import { IQueryOptions } from "../types/query-options";
import { TFilter, TFieldFilter } from "../types/field-filter";
import { MONGO_OPERATION_HANDLERS } from "./mongo-operation-handlers";
import { TMongoFilter } from "../types";

export function mapMongoQueryOptions<T extends object>(
  options?: IQueryOptions<T>,
) {
  const filter = options?.filter;

  const mappedWhereOptions = Array.isArray(filter)
    ? { $or: filter.map((item) => mapWhereOptions<T>(item)) }
    : mapWhereOptions<T>(filter ?? {});

  return {
    filter: mappedWhereOptions,
    sort: options?.sort,
    limit: options?.pagination?.limit,
    skip: options?.pagination?.offset,
  };
}

function mapFieldFilter(filter: any) {
  const mappedObj: Record<string, any> = {};

  for (const [operator, value] of Object.entries(filter)) {
    if (value == null) continue;

    const handler =
      MONGO_OPERATION_HANDLERS[operator as keyof TFieldFilter<any>];

    if (handler) {
      Object.assign(mappedObj, handler(value));
    }
  }

  return mappedObj;
}

function mapWhereOptions<T extends object>(
  filter: TFilter<T>,
): TMongoFilter<T> {
  const mappedWhere: Partial<TMongoFilter<T>> = {};

  for (const [field, value] of Object.entries(filter)) {
    if (value === undefined) continue;

    if (field === "AND" || field === "OR") {
      const mongoLogicOp = field === "AND" ? "$and" : "$or";

      (mappedWhere as any)[mongoLogicOp] = (value as Array<TFilter<T>>).map(
        (item) => mapWhereOptions(item),
      );

      continue;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      const mappedField = mapFieldFilter(value);

      if (Object.keys(mappedField).length > 0) {
        (mappedWhere as any)[field] = mappedField;
      }
    } else {
      (mappedWhere as any)[field] = value;
    }
  }

  return mappedWhere as TMongoFilter<T>;
}
