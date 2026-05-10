import { Injectable } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { CreateAttendanceDto } from '@absence-record/shared';

@Injectable()
export class AttendanceService {
  constructor(private readonly repository: AttendanceRepository) {}

  async getAllRecords() {
    return this.repository.findAll();
  }

  async recordAbsence(data: CreateAttendanceDto) {
    return this.repository.create(data);
  }
}
