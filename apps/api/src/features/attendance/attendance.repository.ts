import { Injectable, Inject } from '@nestjs/common';
import { DB_PROVIDER, DbProvider } from '../../database/db.provider';
import { CreateAttendanceDto } from '@absence-record/shared';

export interface AttendanceRow {
  id: string;
  user_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  note?: string;
  date: Date;
  created_at: Date;
}

export interface Attendance extends Omit<AttendanceRow, 'user_id' | 'created_at'> {
  userId: string;
  createdAt: Date;
}


@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject(DB_PROVIDER) private readonly dbService: DbProvider,
  ) { }

  private get db() {
    return this.dbService.pool;
  }

  async findAll(): Promise<Attendance[]> {
    const { rows } = await this.db.query<AttendanceRow>('SELECT * FROM attendance ORDER BY created_at DESC');
    return rows.map(row => {
      const { user_id, created_at, ...attendance } = row;
      return {
        ...attendance,
        userId: user_id,
        createdAt: created_at,
      };
    });
  }


  async findByUserIdAndDate(userId: string, date: Date): Promise<Attendance | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { rows } = await this.db.query<AttendanceRow>(
      'SELECT * FROM attendance WHERE user_id = $1 AND date BETWEEN $2 AND $3 LIMIT 1',
      [userId, startOfDay, endOfDay]
    );

    if (rows[0]) {
      const { user_id, created_at, ...attendance } = rows[0];
      return {
        ...attendance,
        userId: user_id,
        createdAt: created_at,
      };
    }
    return null;
  }


  async create(data: CreateAttendanceDto): Promise<Attendance[]> {
    const { rows } = await this.db.query<AttendanceRow>(
      'INSERT INTO attendance (user_id, status, note, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [data.userId, data.status, data.note, new Date(data.date)]
    );

    return rows.map(row => {
      const { user_id, created_at, ...attendance } = row;
      return {
        ...attendance,
        userId: user_id,
        createdAt: created_at,
      };
    });
  }

}
