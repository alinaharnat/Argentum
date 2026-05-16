import { Exclude, Expose, Transform } from "class-transformer";
import { Types } from "mongoose";
import { GoalStatus } from "../../enums";

@Exclude()
export class GoalResponseDto {
  constructor(partial: Partial<GoalResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Transform(({ value }) => value?.toString())
  _id: Types.ObjectId;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  targetAmount: number;

  @Expose()
  currentAmount: number;

  @Expose()
  @Transform(({ obj }) => obj.targetAmount - obj.currentAmount)
  remainingAmount: number;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.targetAmount) {
      return 0;
    }

    const progress = (obj.currentAmount / obj.targetAmount) * 100;

    return Math.min(100, Number(progress.toFixed(2)));
  })
  progressPercentage: number;

  @Expose()
  currency: string;

  @Expose()
  @Transform(({ value }) => (value ? new Date(value) : value))
  targetDate?: Date;

  @Expose()
  status: GoalStatus;

  @Expose()
  @Transform(({ value, obj }) => {
    const rawValue = value ?? obj.createdAt ?? obj.created_at;

    return rawValue ? new Date(rawValue) : rawValue;
  })
  createdAt: Date;

  @Expose()
  @Transform(({ value, obj }) => {
    const rawValue = value ?? obj.updatedAt ?? obj.updated_at;

    return rawValue ? new Date(rawValue) : rawValue;
  })
  updatedAt: Date;
}
