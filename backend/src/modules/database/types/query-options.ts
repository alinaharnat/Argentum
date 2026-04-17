import { TFilter } from "./field-filter";

export interface IQueryOptions<T> {
  filter?: TFilter<T>;
  sort?: Record<string, 1 | -1>;
  pagination?: {
    limit?: number;
    offset?: number;
  };
}
