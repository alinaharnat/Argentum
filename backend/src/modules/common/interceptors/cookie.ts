import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Response } from "express";
import { Observable, tap } from "rxjs";
import { ISetCookieMetadata, IClearCookieMetadata } from "../types";
import { CookieMetadataKey } from "../enums";

@Injectable()
export class CookieInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const handler = context.getHandler();

    const setCookie = this.reflector.get<ISetCookieMetadata>(
      CookieMetadataKey.SetCookie,
      handler,
    );

    const clearCookie = this.reflector.get<IClearCookieMetadata>(
      CookieMetadataKey.ClearCookie,
      handler,
    );

    return next.handle().pipe(
      tap((data) => {
        const res = context.switchToHttp().getResponse<Response>();

        if (setCookie) {
          setCookies(res, setCookie, data);
        }

        if (clearCookie) {
          clearCookies(res, clearCookie);
        }
      }),
    );
  }
}

function clearCookies(res: Response, clearCookie: IClearCookieMetadata) {
  res.clearCookie(clearCookie.key, clearCookie.options);
}

function setCookies(res: Response, setCookie: ISetCookieMetadata, data: any) {
  const value = data[setCookie.valuePath];

  res.cookie(setCookie.key, value, {
    httpOnly: true,
    secure: true,
    ...setCookie.options,
  });
}
