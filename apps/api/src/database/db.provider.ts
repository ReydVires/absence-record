import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const DB_PROVIDER = 'DB_PROVIDER';

@Injectable()
export class DbProvider implements OnModuleInit {
  public pool: Pool;

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');

    this.pool = new Pool({
      connectionString: databaseUrl || 'postgresql://user:password@localhost:5432/absence_record',
    });
  }
}
