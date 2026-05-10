import { Module, Global } from '@nestjs/common';
import { DrizzleProvider, DRIZZLE_PROVIDER } from './db.provider';

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_PROVIDER,
      useClass: DrizzleProvider,
    },
  ],
  exports: [DRIZZLE_PROVIDER],
})
export class DbModule { }
