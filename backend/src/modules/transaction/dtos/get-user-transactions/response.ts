import { Exclude, Expose, Type } from "class-transformer";
import { TransactionResponseDto } from "../transaction";

@Exclude()
export class GetUserTransactionsResponseDto {
  constructor(partial: Partial<GetUserTransactionsResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  @Type(() => TransactionResponseDto)
  data: TransactionResponseDto[];
}
