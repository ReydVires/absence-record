import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequest } from '@absence-record/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginRequest) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: LoginRequest) {
    return this.authService.register(registerDto);
  }
}
