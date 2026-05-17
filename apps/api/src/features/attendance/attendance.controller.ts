import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, CheckOutRequest } from '@absence-record/shared';
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

  @Patch(':id/checkout')
  async checkout(@Param('id') id: string, @Body() data: CheckOutRequest) {
    return this.service.checkout(id, data);
  }
}
