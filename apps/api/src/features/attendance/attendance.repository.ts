import { Injectable, Inject } from '@nestjs/common';
import { DB_PROVIDER, DbProvider } from '../../database/db.provider';
import { CreateAttendanceDto, AttendanceResponse } from '@absence-record/shared';

// Repository entity uses Date objects instead of string ISO dates
export type Attendance = Omit<AttendanceResponse, 'date' | 'createdAt' | 'checkOutTime'> & {
  date: Date;
  createdAt: Date;
  checkOutTime: Date | null;
};

export interface AttendanceRow {
  id: string;
  user_id: string;
  status: Attendance['status'];
  note?: string;
  image_name?: string;
  date: Date;
  check_out_time: Date | null;
  created_at: Date;
}

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject(DB_PROVIDER) private readonly dbService: DbProvider,
  ) { }

  private get db() {
    return this.dbService.pool;
  }

  private mapRow(row: AttendanceRow): Attendance {
    const { user_id, created_at, image_name, check_out_time, ...rest } = row;
    return {
      ...rest,
      userId: user_id,
      imageName: image_name,
      checkOutTime: check_out_time,
      createdAt: created_at,
    };
  }

  async findAll(): Promise<Attendance[]> {
    const { rows } = await this.db.query<AttendanceRow>('SELECT * FROM attendance ORDER BY created_at DESC');
    return rows.map(this.mapRow);
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

    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async create(data: CreateAttendanceDto): Promise<Attendance> {
    const { rows } = await this.db.query<AttendanceRow>(
      'INSERT INTO attendance (user_id, status, note, image_name, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.userId, data.status, data.note, data.imageName, new Date(data.date)]
    );
    return this.mapRow(rows[0]);
  }

  async updateCheckout(id: string, checkOutTime: Date): Promise<Attendance | null> {
    const { rows } = await this.db.query<AttendanceRow>(
      'UPDATE attendance SET check_out_time = $1 WHERE id = $2 RETURNING *',
      [checkOutTime, id]
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }
}

