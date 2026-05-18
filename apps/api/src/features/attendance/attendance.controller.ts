import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto, CheckOutRequest } from '@absence-record/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) { }

  @Get()
  async getRecords(@Request() req: { user: { id: string; role: string } }) {
    return this.service.findAll(req.user);
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
