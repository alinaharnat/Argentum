import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Types } from "mongoose";

export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Types.ObjectId => {
    const request = context.switchToHttp().getRequest();
    return request.user.userId;
  },
);
