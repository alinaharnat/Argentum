import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EnvService } from "../env/services";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        uri: env.mongoDbUrl,
      }),
    }),
  ],
})
export class DatabaseModule {}
