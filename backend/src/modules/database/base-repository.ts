import { Model, Types } from "mongoose";
import { IQueryOptions } from "./types/query-options";
import { TFilter } from "./types/field-filter";
import { mapMongoQueryOptions } from "./mapper";

export abstract class BaseRepository<T extends object> {
  constructor(protected readonly model: Model<T>) {}

  async create(document: Omit<T, "_id"> | Partial<T>): Promise<T> {
    const documentToSave = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await documentToSave.save()).toJSON() as T;
  }

  async getById(id: Types.ObjectId): Promise<T | null> {
    return this.model.findById(id).lean().exec();
  }

  async find(options: IQueryOptions<T> = {}): Promise<T[]> {
    const { filter, sort, limit, skip } = mapMongoQueryOptions<T>(options);

    return this.model
      .find(filter)
      .sort(sort)
      .limit(limit ?? 0)
      .skip(skip ?? 0)
      .lean()
      .exec();
  }

  async findOne(filter: TFilter<T>): Promise<T | null> {
    const { filter: mongoFilter } = mapMongoQueryOptions<T>({
      filter,
    });

    return this.model.findOne(mongoFilter).lean().exec();
  }

  async delete(options: IQueryOptions<T>): Promise<T | null> {
    const { filter } = mapMongoQueryOptions<T>(options);

    return this.model.findOneAndDelete(filter).lean().exec();
  }

  async deleteMany(options: IQueryOptions<T>): Promise<number> {
    const { filter } = mapMongoQueryOptions<T>(options);

    const result = await this.model.deleteMany(filter).exec();

    return result.deletedCount ?? 0;
  }

  async update(
    options: IQueryOptions<T>,
    update: Partial<T>,
  ): Promise<T | null> {
    const { filter } = mapMongoQueryOptions<T>(options);

    return this.model
      .findOneAndUpdate(filter, update, {
        new: true,
      })
      .lean()
      .exec();
  }

  async updateMany(
    options: IQueryOptions<T>,
    update: Partial<T>,
  ): Promise<number> {
    const { filter } = mapMongoQueryOptions<T>(options);

    const result = await this.model.updateMany(filter, update).exec();

    return result.modifiedCount ?? 0;
  }
}
