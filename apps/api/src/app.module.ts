import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './database/db.module';
import { AttendanceModule } from './features/attendance/attendance.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule, AttendanceModule],
})
export class AppModule {}
