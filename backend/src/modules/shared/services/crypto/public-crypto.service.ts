import * as crypto from 'crypto';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

@Injectable()
export class PublicCryptoService {
  private readonly algorithm: string;
  private readonly key: string;

  constructor(private readonly configService: ConfigService) {
    this.algorithm = configService.publicCryptoAlgorithm;
    this.key = configService.publicCryptoKey;
  }

  public encryptStringify<T>(obj: T): string {
    return this.encrypt(JSON.stringify(obj));
  }

  public decryptStringify<T>(publicString: string): T {
    const decrypted = this.decrypt(publicString);
    const obj = JSON.parse(decrypted) as any;

    return obj as T;
  }

  public encrypt(str: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(str);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const hashedString = iv.toString('hex') + ':' + encrypted.toString('hex');

    return Buffer.from(hashedString).toString('base64');
  }

  public decrypt(publicString: string): string {
    const hashedString = Buffer.from(publicString, 'base64').toString('ascii');

    const parts = hashedString.split(':');

    const iv = Buffer.from(parts[0], 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    return decipher.update(parts[1], 'hex', 'utf8') + decipher.final('utf8');
  }
}
