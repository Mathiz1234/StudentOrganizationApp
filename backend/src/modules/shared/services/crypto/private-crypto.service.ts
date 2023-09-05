import * as crypto from 'crypto';

import { StringHelper } from '../../helpers/string.helper';

export class PrivateCryptoService {
  static generatePasswordHash(password: string, salt: string): Promise<string> {
    return this.generateHash(password, salt, 1000, 64);
  }

  static generateTokenHash(token: string, salt: string): Promise<string> {
    return this.generateHash(token, salt, 10, 32);
  }

  static generateSalt() {
    return crypto.randomBytes(16).toString('hex');
  }

  static generateHash(
    value: string,
    salt: string,
    iterations: number,
    keyLength: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        value,
        salt,
        iterations,
        keyLength,
        `sha512`,
        (err, key) => {
          if (err) return reject();
          return resolve(key.toString('hex'));
        },
      );
    });
  }

  static generatePassword(): string {
    const length = 8;

    const normalCharset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const specialCharset = '@#$%&';

    let password = Array.from({ length }).reduce<string>(
      (password) => (password += StringHelper.randomChar(normalCharset)),
      '',
    );

    password = StringHelper.setCharAt(
      password,
      StringHelper.randomIndex(password),
      StringHelper.randomChar(specialCharset),
    );

    return password;
  }
}
