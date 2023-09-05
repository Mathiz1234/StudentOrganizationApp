import { Global, Module } from '@nestjs/common';

import dataSource from './data-source';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: async () => {
        return dataSource.initialize();
      },
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}
