import { Exclude, Expose } from "class-transformer";

@Exclude()
export class RegisterResponseDto {
  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  accessToken: string;

  refreshToken: string;
}
