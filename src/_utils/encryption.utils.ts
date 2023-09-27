import { compare, genSalt, hash } from 'bcrypt';
import { randomBytes } from 'crypto';

export class EncryptionUtils {
  static async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await genSalt(saltOrRounds);
    return await hash(password, salt);
  }

  static async validatePassword(
    password: string,
    hashedPwd: string,
  ): Promise<boolean> {
    return await compare(password, hashedPwd);
  }

  static tokenGenerator(): string {
    return randomBytes(10).toString('base64url');
  }
}
