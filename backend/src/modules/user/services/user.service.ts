import { Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { UserRepository } from "../repositories";
import { User } from "../schemas";
import { UserField } from "../enums";
import { ISetLoginAttempts, ISetLockUntil } from "./types";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.get({
      email,
    });
  }

  public getUserById(id: Types.ObjectId): Promise<User | null> {
    return this.userRepository.getById(id);
  }

  public async setLoginAttempts({ userId, loginAttempts }: ISetLoginAttempts) {
    await this.userRepository.update(
      {
        filter: { [UserField.Id]: userId },
      },
      {
        [UserField.LoginAttempts]: loginAttempts,
      },
    );
  }

  public async setLockUntil({ userId, lockUntil }: ISetLockUntil) {
    await this.userRepository.update(
      {
        filter: { [UserField.Id]: userId },
      },
      {
        [UserField.LockUntil]: lockUntil,
      },
    );
  }
}
