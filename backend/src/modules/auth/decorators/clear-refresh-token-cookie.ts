import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { ClearCookie } from "../../common/decorators";
import { CookieInterceptor } from "../../common/interceptors";
import { CookieKey, CookiePath } from "../../common/enums";

export function ClearRefreshTokenCookie() {
  return applyDecorators(
    UseInterceptors(CookieInterceptor),
    ClearCookie({
      key: CookieKey.RefreshToken,
      options: {
        path: CookiePath.Auth,
      },
    }),
  );
}
