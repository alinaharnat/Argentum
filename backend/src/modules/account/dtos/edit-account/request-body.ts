import { IsString, IsOptional, IsIn, MaxLength } from "class-validator";

export class EditAccountRequestBodyDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @IsIn(["CASH", "BANK", "SAVINGS"], { message: "Invalid account type" })
  type?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
