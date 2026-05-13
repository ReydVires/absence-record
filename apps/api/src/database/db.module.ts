import { Module, Global } from '@nestjs/common';
import { DbProvider, DB_PROVIDER } from './db.provider';

@Global()
@Module({
  providers: [
    {
      provide: DB_PROVIDER,
      useClass: DbProvider,
    },
  ],
  exports: [DB_PROVIDER],
})
export class DbModule { }
