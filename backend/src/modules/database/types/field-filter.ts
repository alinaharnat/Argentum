export type TFieldFilter<T> = {
  eq?: T;
  ne?: T;
  in?: T[];
  like?: string;
  ilike?: string;
  gt?: number | Date;
  gte?: number | Date;
  lt?: number | Date;
  lte?: number | Date;
  isNull?: boolean;
};

export type TLogicalFilter<T> = {
  AND?: Array<TFilter<T>>;
  OR?: Array<TFilter<T>>;
};

export type TFilter<T> = {
  [K in keyof T]?: TFieldFilter<T[K]> | T[K] | any;
} & TLogicalFilter<T>;
