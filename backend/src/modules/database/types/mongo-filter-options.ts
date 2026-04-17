export type TMongoFilter<T> = {
  [K in keyof T]?: any;
} & {
  $and?: TMongoFilter<T>[];
  $or?: TMongoFilter<T>[];
};
