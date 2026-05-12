import { Injectable, Inject } from '@nestjs/common';
import { and, eq, between } from 'drizzle-orm';
import * as schema from '../../database/schema';
import { DRIZZLE_PROVIDER, DrizzleProvider } from '../../database/db.provider';
import { CreateAttendanceDto } from '@absence-record/shared';

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private readonly dbService: DrizzleProvider, // Injected DrizzleProvider
  ) { }

  private get db() {
    return this.dbService.db;
  }

  async findAll() {
    return this.db.query.attendance.findMany();
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const results = await this.db
      .select()
      .from(schema.attendance)
      .where(
        and(
          eq(schema.attendance.userId, userId),
          between(schema.attendance.date, startOfDay, endOfDay)
        )
      )
      .limit(1);

    return results[0];
  }

  async create(data: CreateAttendanceDto) {
    return this.db
      .insert(schema.attendance)
      .values({
        ...data,
        userId: data.userId,
        status: data.status,
        date: new Date(data.date),
      })
      .returning();
  }
}
