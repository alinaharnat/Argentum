import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../../../user/services";
import { HashService } from "../../../common/services";
import {
  ILoginParams,
  IRegisterParams,
  IAuthTokens,
  ILoginResult,
} from "./types";
import { Types } from "mongoose";
import { SessionService } from "../session";
import { User } from "../../../user/schemas";

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  public async register({
    email,
    password,
    firstName,
    lastName,
  }: IRegisterParams): Promise<IAuthTokens> {
    const existingUser = await this.validateByEmail(email);

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const passwordHash = await this.hashService.hash(password);

    const user = await this.userService.createUser({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    return this.sessionService.createSession(user._id);
  }

  public async login({ email, password }: ILoginParams): Promise<IAuthTokens> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException("User does not exist");
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.sessionService.createSession(user._id);
  }

  public logout(refreshToken: string): Promise<boolean> {
    return this.sessionService.removeSession(refreshToken);
  }

  public refresh(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<string | undefined> {
    return this.sessionService.refreshSession(userId, refreshToken);
  }

  public getCurrentUser(userId: Types.ObjectId): Promise<User | null> {
    return this.userService.getUserById(userId);
  }

  private validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return this.hashService.compare(password, passwordHash);
  }

  private async validateByEmail(email: string): Promise<boolean> {
    const user = await this.userService.getUserByEmail(email);

    return !!user;
  }
}
