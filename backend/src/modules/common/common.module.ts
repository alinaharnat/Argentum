import { Module } from "@nestjs/common";
import { HashService } from "./services";

@Module({
  exports: [HashService],
  providers: [HashService],
})
export class CommonModule {}
