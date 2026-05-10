import { Controller, Get, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from '@absence-record/shared';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get()
  async getRecords() {
    return this.service.getAllRecords();
  }

  @Post()
  async createRecord(@Body() data: CreateAttendanceDto) {
    return this.service.recordAbsence(data);
  }
}
