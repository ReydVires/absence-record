import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { AttendanceRepository } from './attendance.repository';
import { ApiResponse, CreateAttendanceDto, CheckOutRequest } from '@absence-record/shared';

@Injectable()
export class AttendanceService {
  constructor(private readonly repository: AttendanceRepository) { }

  async findAll(user: { id: string; role: string }): Promise<ApiResponse<{
    [x: string]: unknown;
  }>> {
    const data = user.role === 'admin' 
      ? await this.repository.findAll()
      : await this.repository.findByUserId(user.id);

    return {
      data: {
        attendances: data,
      },
      statusCode: 200,
      message: 'success',
    }
  }

  async create(data: CreateAttendanceDto) {
    const existingRecord = await this.repository.findByUserIdAndDate(
      data.userId,
      new Date(data.date),
    );

    if (existingRecord) {
      throw new BadRequestException('Already clocked in for today');
    }

    const record = await this.repository.create(data);

    return {
      data: record,
      statusCode: 201,
      message: 'Check in successful',
    };
  }

  async checkout(id: string, dto: CheckOutRequest) {
    const record = await this.repository.updateCheckout(id, new Date(dto.checkOutTime));

    if (!record) {
      throw new NotFoundException('Attendance record not found');
    }

    return {
      data: record,
      statusCode: 200,
      message: 'Check out successful',
    };
  }
}

