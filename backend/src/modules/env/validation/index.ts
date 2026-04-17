import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { EnvironmentVariables } from "./validation-schema";

export function validateEnv(env: Record<string, unknown>) {
  const validatedEnv = plainToInstance(EnvironmentVariables, env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedEnv, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedEnv;
}
