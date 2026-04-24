import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { SetCookie } from "../../common/decorators";
import { CookieInterceptor } from "../../common/interceptors";
import { CookieKey, CookiePath } from "../../common/enums";

export function SetRefreshTokenCookie() {
  return applyDecorators(
    UseInterceptors(CookieInterceptor),
    SetCookie({
      key: CookieKey.RefreshToken,
      valuePath: CookieKey.RefreshToken,
      options: {
        path: CookiePath.Auth,
      },
    }),
  );
}
