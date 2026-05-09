import { IsOptional, IsBoolean, IsString, IsIn } from "class-validator";
import { Transform } from "class-transformer";
import { AccountField, AccountType } from "../../enums";
import { SortOrder } from "../../../common/enums";

export class GetAccountsQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === "true")
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @IsIn([AccountField.Name, AccountField.Balance, AccountField.CreatedAt])
  sortBy: string = AccountField.CreatedAt;

  @IsOptional()
  @IsIn([SortOrder.Ascending, SortOrder.Descending])
  @Transform(({ value }) => Number(value))
  sortOrder: SortOrder = SortOrder.Descending;

  @IsOptional()
  @IsString()
  @IsIn([AccountType.Cash, AccountType.Bank, AccountType.Savings])
  type?: string;
}
