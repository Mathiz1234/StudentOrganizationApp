import { Module } from '@nestjs/common';

import { PublicCryptoService } from './public-crypto.service';

@Module({
  imports: [],
  providers: [PublicCryptoService],
  exports: [PublicCryptoService],
})
export class CryptoModule {}
