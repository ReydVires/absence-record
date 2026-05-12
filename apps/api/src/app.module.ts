import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './database/db.module';
import { AttendanceModule } from './features/attendance/attendance.module';
import { AuthModule } from './features/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AttendanceModule,
    AuthModule,
  ],
})
export class AppModule {}
