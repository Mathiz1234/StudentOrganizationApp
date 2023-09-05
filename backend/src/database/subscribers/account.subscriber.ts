import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

import { PrivateCryptoService } from '../../modules/shared/services/crypto/private-crypto.service';
import { Account } from '../entities';

@EventSubscriber()
export class AccountSubscriber implements EntitySubscriberInterface<Account> {
  listenTo() {
    return Account;
  }

  async beforeInsert(event: InsertEvent<Account>) {
    event.entity.refreshTokenSalt = PrivateCryptoService.generateSalt();
  }

  async beforeUpdate(event: UpdateEvent<Account>) {
    if (
      event.entity?.refreshTokenHash !== null &&
      event.entity?.refreshTokenHash !== event.databaseEntity?.refreshTokenHash
    ) {
      event.entity.refreshTokenHash =
        await PrivateCryptoService.generateTokenHash(
          event.entity.refreshTokenHash,
          event.entity.refreshTokenSalt,
        );
    }
  }
}
