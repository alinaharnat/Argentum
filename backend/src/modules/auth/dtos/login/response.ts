import { Exclude, Expose } from "class-transformer";

@Exclude()
export class LoginResponseDto {
  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  accessToken: string;

  refreshToken: string;
}
