import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './database/db.module';
import { AttendanceModule } from './features/attendance/attendance.module';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    AttendanceModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
