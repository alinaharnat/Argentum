import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import type { IRefreshRequest } from "../types";
import { AuthService } from "../services";
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  ProfileResponseDto,
} from "../dtos";
import { RefreshTokenGuard } from "../guards";
import { SetRefreshTokenCookie, ClearRefreshTokenCookie } from "../decorators";
import { GetCookie } from "../../common/decorators";
import { CookieKey } from "../../common/enums";
import { ThrottlerGuard, Throttle } from "@nestjs/throttler";
import { AccessTokenGuard } from "../guards";
import { CurrentUserId } from "../../common/decorators";
import { Types } from "mongoose";
import { NotFoundException } from "@nestjs/common";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("registration")
  @SetRefreshTokenCookie()
  public async register(
    @Body() body: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const result = await this.authService.register(body);

    return new RegisterResponseDto(result);
  }

  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 300000 } })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @SetRefreshTokenCookie()
  public async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(body);

    return new LoginResponseDto(result);
  }

  @Patch("tokens")
  @UseGuards(RefreshTokenGuard)
  public async refresh(
    @Req() req: IRefreshRequest,
  ): Promise<RefreshResponseDto> {
    const { userId, refreshToken } = req.user;

    const accessToken = await this.authService.refresh(userId, refreshToken);

    return new RefreshResponseDto({ accessToken });
  }

  @Delete("logout")
  @ClearRefreshTokenCookie()
  public async logout(
    @GetCookie(CookieKey.RefreshToken) refreshToken: string,
  ): Promise<void> {
    await this.authService.logout(refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get("me")
  public async getCurrentUser(
    @CurrentUserId() userId: Types.ObjectId,
  ): Promise<ProfileResponseDto> {
    const user = await this.authService.getCurrentUser(userId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return new ProfileResponseDto(user);
  }
}
