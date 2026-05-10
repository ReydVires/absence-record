import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';

@Injectable()
export class DrizzleProvider implements OnModuleInit {
  public db: NodePgDatabase<typeof schema>;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    const pool = new Pool({
      connectionString: databaseUrl || 'postgresql://user:password@localhost:5432/absence_record',
    });
    this.db = drizzle(pool, { schema });
  }
}
