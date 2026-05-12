import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import * as schema from '../../database/schema';
import { DRIZZLE_PROVIDER, DrizzleProvider } from '../../database/db.provider';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly dbService: DrizzleProvider,
  ) { }

  private get db() {
    return this.dbService.db;
  }

  async findByEmail(email: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return results[0];
  }

  async findById(id: string) {
    const results = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return results[0];
  }

  async create(data: typeof schema.users.$inferInsert) {
    const results = await this.db
      .insert(schema.users)
      .values(data)
      .returning();
    return results[0];
  }
}
