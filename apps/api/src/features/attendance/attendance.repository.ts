import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../database/schema';
import { DRIZZLE_PROVIDER } from '../../database/db.provider';
import { CreateAttendanceDto } from '@absence-record/shared';

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly dbService: any, // Injected DrizzleProvider
  ) { }

  private get db() {
    return this.dbService.db;
  }

  async findAll() {
    return this.db.query.attendance.findMany();
  }

  async create(data: CreateAttendanceDto) {
    return this.db
      .insert(schema.attendance)
      .values({
        ...data,
        date: new Date(data.date),
      })
      .returning();
  }
}
