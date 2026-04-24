import { Exclude, Expose } from "class-transformer";
import { Types } from "mongoose";

@Exclude()
export class RefreshResponseDto {
  constructor(partial: Partial<RefreshResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  accessToken: string;
}
