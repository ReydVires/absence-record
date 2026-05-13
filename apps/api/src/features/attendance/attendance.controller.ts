import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from '@absence-record/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) { }

  @Get()
  async getRecords() {
    return this.service.findAll();
  }

  @Post()
  async createRecord(@Body() data: CreateAttendanceDto) {
    return this.service.create(data);
  }
}
