import { Exclude, Expose, Type } from "class-transformer";
import { AccountResponseDto } from "../account";

@Exclude()
export class GetUserAccountsResponseDto {
  constructor(partial: Partial<GetUserAccountsResponseDto>) {
    Object.assign(this, partial);
  }
  @Expose()
  @Type(() => AccountResponseDto)
  data: AccountResponseDto[];
}
